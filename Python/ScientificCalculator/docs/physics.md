# physics.md

Updated: Detailed reference derived from functions/physics.py

This document is a derived, function-by-function explanation of the physics helper module implemented at `functions/physics.py`. It lists each callable, the formula used, the numeric types involved, edge-case checks, and derivations or notes about implementation details and caveats. Where the implementation departs from the typical formula (bugs or hard-coded constants), this file explicitly documents that and suggests the intended formula.

NOTE: The implementation relies primarily on Python's Decimal for deterministic decimal precision. A few functions use Python floats (math.*) internally for trigonometry or hypot; those are converted back to Decimal when returned. Units are not enforced by the code — SI units are recommended (meters, kilograms, seconds, Kelvin, Pascals, Joules, etc.).

---

## Implementation notes (numeric types)

- Most algebraic results are returned as Decimal objects (from the decimal module).
- Trigonometric and some hypotenuse calculations use float-based math functions and convert results back to Decimal where the function returns numeric values.
- The module sets Decimal precision via `getcontext().prec = 28`.

---

## Index (by section)

0. Basic mechanics & particles
1. Geometric kinematics
2. Core kinematics & dynamics
3. Friction
4. Resultant fluid densities
5. Temperature conversions
6. Utility kinematic & mechanics helpers
7. Perimeters & areas (shapes)
8. Volumes (shapes)

---

## 0. BASIC MECHANICS & PARTICLES

pressure(force, area)
- Signature: pressure(force, area) -> Decimal
- Formula: pressure = force / area
- Implementation: converts inputs to Decimal via Decimal(str(...)) and returns their quotient.
- Units: force in Newtons (N), area in m^2, pressure in Pascals (Pa).

time_from_velocity(displacement, velocity)
- Formula: t = displacement / velocity
- Returns Decimal. Division by zero is not explicitly guarded; Python will raise ZeroDivisionError.

displacement_hypotenuse(a, b)
- Formula: sqrt(a^2 + b^2)
- Implementation detail: squares are computed using Decimal but math.sqrt requires float, so the Decimal sum is converted to float and then math.sqrt returns a float.
- Return value: float — note this differs from the Decimal-returning convention in most functions.

right_angled_adjacent(opposite, hypotenuse)
- Formula: adjacent = sqrt(hypotenuse^2 - opposite^2)
- Implementation: computes Decimal difference then uses math.sqrt(float(...)). Returns a float.
- Edge cases: if opposite >= hypotenuse, you'll get math domain error (sqrt of negative number). The function does not explicitly validate inputs.

direction_of_displacement(dx, dy)
- Intended Formula: angle = degrees(atan2(dy, dx))
- Implementation: the current implementation in the source contains a syntax error and will not run. The intended and correct implementation should be:
  return Decimal(str(math.degrees(math.atan2(float(dec_dy), float(dec_dx)))))
- Edge cases: canonical math.atan2 handles dx == 0 automatically and returns ±90 degrees as appropriate.

impulse(force, time)
- Physical formula: impulse = force * time (units N·s)
- Implementation issue: the code computes force / time which is incorrect for impulse. Current implementation:
  return Decimal(str(force)) / Decimal(str(time))
- Suggested fix: return Decimal(str(force)) * Decimal(str(time))

latent_heat(heat_energy_joules, mass_kg)
- Formula: L = Q / m
- Implementation: returns Decimal(heat_energy_joules) / Decimal(mass_kg)
- Units: J/kg

calorific_value(total_heat_joules, mass_kg)
- Formula: CV = Q / m
- Implementation: division returning Decimal

heat_for_phase_change(mass_kg, latent_heat_constant)
- Formula: Q = m * L
- Returns Decimal

heat_from_combustion(mass_fuel_kg, calorific_value_constant)
- Formula: Q = m_fuel * CV
- Returns Decimal

specific_heat_capacity(heat, mass, delta_temperature)
- Formula: c = Q / (m * ΔT)
- Implementation: constructs denominator mass*delta_temperature as Decimal then divides heat by that term.
- Edge cases: Delta T == 0 will raise ZeroDivisionError indirectly.

heat_for_temperature_change(mass, specific_heat_constant, delta_temperature)
- Formula: Q = m * c * ΔT
- Implementation returns Decimal product

area(force, pressure)
- Formula: A = F / p
- Implementation: Decimal division

volume(length)
- Formula: V = length^3 (cube)
- Implementation: Decimal ** 3

energy(h, frequency)
- Expected formula: E = h * f
- Implementation detail (important): The function signature accepts `h` but the implementation ignores it and uses a hard-coded constant Decimal('6.625e-34') * Decimal(str(frequency)). This deviates from the expected use of Planck's constant passed by the caller and uses a value slightly different from CODATA (6.62607015e-34 J·s). Consider switching to the provided `h` argument or documenting the tracked constant.
- Units: Joules (if h is in J·s and f in Hz)

frequency(energy, h)
- Expected: f = E / h
- Implementation issue: returns Decimal(str(energy)) / Decimal('6.625e-34') ignoring the h parameter. Should instead divide by the provided `h`.

diagonal_square(side)
- Formula: diagonal = side * sqrt(2)
- Implementation: uses Decimal('2').sqrt() for sqrt(2)

diagonal_rectangle(length, width)
- Formula: sqrt(length^2 + width^2)
- Implementation: computes Decimal squares and uses Decimal.sqrt()

side(area)
- Formula: side = sqrt(area)
- Implementation: Decimal.sqrt()

weight(mass, g)
- Formula: W = m * g
- Returns Decimal

---

## 1. GEOMETRIC KINEMATICS

distance_circle(revolution, radius=1)
- Formula: distance = revolutions * (2 * pi * radius)
- Implementation: uses Decimal for revolution and radius, and Decimal(str(math.pi)) for pi. Returns Decimal.

displacement_circle(revolution, radius=1)
- Purpose: straight-line chord displacement across circle after a fractional revolution.
- Approach and cases:
  - The function reduces revolution to its fractional part (`fractional_rev = rev % 1`).
  - Special cases: fractional_rev == 0 -> displacement 0; 0.5 -> diameter 2r; 0.25 or 0.75 -> r * sqrt(2).
  - For general cases: chord = 2*r*|sin(pi * fractional_rev)|. Implementation computes angle as float(rev * pi) and sin(angle) and returns Decimal result. Using `fractional_rev` (instead of `rev`) for the float trig input is clearer and avoids unnecessarily large floats.
- Returns Decimal

---

## 2. CORE KINEMATICS & DYNAMICS

calculate_velocity(distance, time)
- Formula: v = distance / time
- Validates time != 0 and raises ZeroDivisionError
- Returns Decimal

calculate_acceleration(initial_velocity, final_velocity, time)
- Formula: a = (v_f - v_i) / t
- Validates time != 0
- Returns Decimal

calculate_force(mass, acceleration)
- Formula: F = m * a
- Returns Decimal

---

## 3. FRICTION ENGINE

calculate_friction(mu, mass, gravity="9.80665")
- Formula implemented: F_f = mu * m * g
- Behavior: converts gravity default string to Decimal; validates mu >= 0 and mass >= 0; raises ValueError otherwise.
- Units: Newtons (N)

---

## 4. RESULTANT FLUID DENSITIES

resultant_density_by_volume(density1, density2)
- Formula: arithmetic mean for equal volumes: (ρ1 + ρ2)/2
- Returns Decimal

resultant_density_by_mass(density1, density2)
- Formula used: (2 * ρ1 * ρ2) / (ρ1 + ρ2)
- This is the harmonic-like average for equal masses — the implementation checks denominator != 0.
- Returns Decimal

resultant_density_general(mass1, volume1, mass2, volume2)
- Formula: (m1 + m2) / (v1 + v2)
- Validates total_volume != 0
- Returns Decimal

---

## 5. UNIFIED TEMPERATURE CONVERSION ENGINE

convert_temperature(value, from_unit, to_unit)
- Behavior: normalize units (c/f/k/r) and follow conversion chain via Celsius as pivot.
- Implemented conversions:
  - from Fahrenheit: C = (F - 32) * 5/9
  - from Kelvin: C = K - 273.15
  - from Réaumur: C = Re * 5/4
  - to Fahrenheit: F = C * 9/5 + 32
  - to Kelvin: K = C + 273.15 — returns a Decimal; warns (prints) if computed K < 0 (physically impossible)
  - to Réaumur: Re = C * 4/5
- Returns Decimal
- Validates unknown units and raises ValueError

---

## 6. MIGRATED BASIC MATH HELPERS

These functions mirror basic kinematics and energy calculations but use Decimal.

distance(speed, time): distance = speed * time
speed(distance, time): speed = distance / time (validates time != 0)
time(distance, speed): time = distance / speed (validates speed != 0)
work(force, distance): W = F * d
power(work, time): P = W / t (validates time != 0)
kineticenergy(mass, velocity): KE = 0.5 * m * v^2
potentialenergy(mass, gravity, height): PE = m * g * h
density(mass, volume): ρ = m / V (validates V != 0)
mass(density, volume): m = ρ * V
volume_by_density(mass, density): V = m / ρ (validates ρ != 0)

All return Decimal and raise ZeroDivisionError when denominators are zero.

---

## 7. PERIMETERS & AREAS (selected functions)

The module defines PI_DEC = Decimal(str(math.pi)) and uses Decimal arithmetic.

circle_circumference(radius): C = 2πr
circle_area(radius): A = π r^2
semicircle_area(radius): A = (π r^2)/2
semicircle_perimeter(radius): perimeter includes diameter: π r + 2 r
ellipse_area(a, b): A = π a b
ellipse_perimeter(a, b): uses Ramanujan's approximation implemented as:
  p ≈ π * [3(a + b) - sqrt((3a + b)*(a + 3b))]
This matches one of Ramanujan's widely used approximations.

square_perimeter(side): 4s
square_area(side): s^2
rectangle_perimeter(length, width): 2(l + w)
rectangle_area(length, width): l*w
parallelogram_perimeter(base, side): 2(b + s)
parallelogram_area(base, height): b*h

triangle_perimeter(a,b,c): a + b + c
triangle_area_heron(a,b,c): uses Heron's formula: sqrt[s(s-a)(s-b)(s-c)] with validation for negative inner term.
triangle_area_base_height(base,height): (base * height)/2

right_triangle_hypotenuse(a,b): uses math.hypot(float(a), float(b)) and returns Decimal of the float result.
right_triangle_area(a,b): (a*b)/2

equilateral_triangle_area(side): (sqrt(3)/4) * s^2

equilateral_triangle_perimeter(side): 3s

isosceles_triangle_area(base, equal_side): computes height = sqrt(s^2 - (b^2/4)) and area = (b*h)/2; validates inner >= 0.

trapezoid_area(a, b, height): (a + b) * height / 2
trapezoid_perimeter(a,b,c,d): a + b + c + d

rhombus_area_by_diagonals(d1,d2): (d1 * d2)/2
rhombus_perimeter_from_diagonals(d1,d2): side = sqrt((d1/2)^2 + (d2/2)^2); perimeter = 4*side

kite_area_by_diagonals(d1,d2): (d1 * d2)/2
kite_perimeter(side1,side2): 2*(side1 + side2)

regular_polygon_perimeter(n_sides, side_length): n * s
regular_polygon_area(n_sides, side_length): area computed using float apothem:
  apothem = s / (2 * tan(pi / n))
  area = 0.5 * n * s * apothem
Note: this implementation converts n to int, side_length to float, computes float area and converts back to Decimal.

regular_pentagon_area, regular_hexagon_area, regular_octagon_area: convenience wrappers with known closed forms. Hexagon and octagon formulas use math.sqrt floats converted to Decimal.

annulus_area(R, r): π (R^2 - r^2)
annulus_perimeter(R, r): 2π (R + r)

sector_area(radius, angle_degrees): A = (r^2 * θ)/2 where θ is in radians (θ = degrees * π/180)
sector_arc_length(radius, angle_degrees): s = r * θ

---

## 8. VOLUMES (selected functions)

cube_volume(side): s^3
cuboid_volume(length, width, height): l * w * h
sphere_volume(radius): (4/3)π r^3
hemisphere_volume(radius): (2/3)π r^3 (half the sphere)
cylinder_volume(radius, height): π r^2 h
cone_volume(radius, height): (1/3)π r^2 h
frustum_cone_volume(r1, r2, height): (1/3)π h (r1^2 + r1 r2 + r2^2)
pyramid_volume(base_area, height): base_area * height / 3
square_pyramid_volume(side, height): (side^2) * height / 3
rectangular_pyramid_volume(length, width, height): (l*w) * height / 3
prism_volume(base_area, length): base_area * length
triangular_prism_volume(base, triangle_height, length): (base*triangle_height/2) * length
regular_tetrahedron_volume(side): s^3 / (6*sqrt(2))
ellipsoid_volume(a,b,c): (4/3) π a b c
torus_volume(R, r): implemented as float V = 2 π^2 R r^2 (converted to Decimal)
hollow_cylinder_volume(R_outer, R_inner, height): π h (Ro^2 - Ri^2) with validation Ri < Ro

---

## Notable implementation issues & suggested fixes

1. direction_of_displacement: current implementation in source contains a syntax error and will not run. Replace with canonical implementation using math.atan2 with floats and convert to Decimal if desired.

2. impulse: Physically, impulse = force * time (N·s) but implementation computes force / time. This is likely a bug and should be fixed.

3. energy and frequency functions ignore the `h` parameter and instead use a hard-coded constant `6.625e-34`. This both ignores the caller-supplied Planck constant and uses a value slightly different from the modern CODATA value (6.62607015e-34 J·s). Consider changing to use the provided `h` argument or to make the constant named (e.g., PLANCK_CONSTANT) and documented.

4. Mixed return types: Several functions return floats (displacement_hypotenuse, right_angled_adjacent, right_triangle_hypotenuse, torus_volume, and regular_polygon_area) while most return Decimal. For API consistency, consider converting float results to Decimal before return (while documenting possible small float round-off due to intermediate math calls).

5. In displacement_circle the float-based angle uses `rev` rather than `fractional_rev` — this works due to trig periodicity, but using fractional_rev would be clearer and avoid unnecessarily large float inputs.

6. Ramanujan ellipse perimeter: Implementation matches one of Ramanujan's forms. Consider documenting approximation accuracy.

7. convert_temperature warns (prints) if Kelvin result < 0; better would be to raise ValueError for invalid physical results or accept a parameter to control strictness.

---

## Unit tests & further recommendations

- Add unit tests for every function, including boundary conditions (zero, negative, invalid triangle sides, inner >= outer radius checks, time/speed zero checks).
- Add a numeric policy: decide whether to standardize on Decimal-only (port math trig to mpmath or decimal-compatible trig) or float-only for performance. Document the choice.
- Add `__all__` in `functions/physics.py` to control exported symbols and update `functions/library.py` registration accordingly.

---

## Examples (matching implementation behavior)

```python
from functions import physics

print(physics.circle_area(3))        # Decimal(pi * 3^2)
print(physics.sphere_volume(1.2))    # Decimal((4/3)*pi*1.2^3)
print(physics.calculate_velocity(100, 9.58))
print(physics.convert_temperature(0, 'c', 'k'))
```

---

If you want, I can also:
- Fix the bugs noted above in `functions/physics.py` and push the code changes in a separate commit (e.g., fix impulse, direction_of_displacement, energy/frequency `h` param, and unify return types).
- Add a `Python/ScientificCalculator/tests/test_physics.py` pytest suite exercising typical and edge cases.

---

End of file
