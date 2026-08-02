# physics.md

# Physics Module — functions/physics.py

This document describes the physics helper functions added to the ScientificCalculator project (Python/ScientificCalculator/functions/physics.py). It summarizes the available functions, the formulas used, usage examples, and important notes about numeric types and validation.

---

## Overview

The physics.py module provides a compact collection of physics, geometry, and engineering helper functions used by the Scientific Calculator. It includes:

- Basic mechanics and particle relations (pressure, weight, energy, frequency, force)
- Geometric kinematics for circles (arc length and chord displacement)
- Core kinematics & dynamics (velocity, acceleration, force)
- Friction calculations
- Density mixture rules
- Temperature conversions (Celsius, Fahrenheit, Kelvin, Réaumur)
- A rich set of perimeter & area functions for many shapes (20+)
- A set of volume formulas for many 3D shapes (15+)
- Small helpers: distance, speed, time, work, power, kinetic/potential energy, density/mass helpers

The implementation uses Decimal for deterministic decimal precision for most algebraic computations. Trigonometric functions internally use floats where needed and results are converted back to Decimal for consistency in many functions.

---

## Numeric approach & types

- Decimal: used for algebraic calculations (areas, volumes, kinematics, densities, temperature conversions) to give consistent decimal precision. The module sets Decimal precision via `getcontext().prec`.
- float: used for trig operations under the hood (math.sin, math.tan, hypot, etc.). Results are converted as needed.

Important: mixing Decimal and float is pragmatic and typical here — if you later prefer float-only performance or full arbitrary-precision math (mpmath), consider standardizing across the module.

---

## How to import

- Module import:

```python
from functions import physics

# call directly
physics.circle_area(3)
```

- From library (MATH_LIB):

```python
from functions.library import MATH_LIB

MATH_LIB['circle_area'](3)
# physics module also available:
MATH_LIB['physics'].circle_area(3)
```

---

## Sections & Selected Functions

Below are the major sections and representative functions. Use `help(function)` or inspect the source for full details.

### 0. Basic mechanics & particles
- pressure(force, area)
  - Formula: pressure = force / area
- area(force, pressure)
  - Formula: area = force / pressure
- volume(length)
  - Cube volume: length^3
- energy(h, frequency)
  - E = h * f
  - Note: legacy code may use a hard-coded Planck-like value; you can pass h explicitly.
- frequency(energy, h)
  - f = E / h
- diagonal_square(side)
  - diagonal = side * sqrt(2)
- diagonal_rectangle(length, width)
  - diagonal = sqrt(length^2 + width^2)
- side(area)
  - side = sqrt(area)
- weight(mass, g)
  - W = m * g (g can be provided)

### 1. Geometric kinematics
- distance_circle(revolution, radius=1)
  - Arc length = revolution * 2*pi*r
- displacement_circle(revolution, radius=1)
  - Chord displacement: 2*r*sin(theta/2) where theta = revolution*2*pi
  - Special-case exact returns for common fractions (0, 1/4, 1/2, 3/4, 1)

### 2. Core kinematics & dynamics
- calculate_velocity(distance, time)
  - v = d / t. Raises if time == 0
- calculate_acceleration(initial_velocity, final_velocity, time)
  - a = (v_f - v_i) / t. Raises if time == 0
- calculate_force(mass, acceleration)
  - F = m * a

### 3. Friction
- calculate_friction(mu, mass, gravity="9.80665")
  - F_f = mu * m * g
  - mu must be >= 0; mass must be non-negative

### 4. Resultant fluid densities
- resultant_density_by_volume(density1, density2)
  - Arithmetic mean for equal volumes
- resultant_density_by_mass(density1, density2)
  - Harmonic-like mixture formula for equal masses
- resultant_density_general(mass1, volume1, mass2, volume2)
  - Total mass / total volume

### 5. Temperature conversions
- convert_temperature(value, from_unit, to_unit)
  - Supports Celsius (c), Fahrenheit (f), Kelvin (k), Réaumur (r)
  - Returns Decimal. Performs absolute zero check for Kelvin outputs

### 6. Utility kinematic & mechanics helpers
- distance(speed, time)
- speed(distance, time)
- time(distance, speed)
- work(force, distance)
- power(work, time)
- kineticenergy(mass, velocity)
- potentialenergy(mass, gravity, height)
- density(mass, volume)
- mass(density, volume)
- volume_by_density(mass, density)

### 7. Perimeters & Areas (representative list)
- circle_circumference(radius), circle_area(radius)
- semicircle_area(radius), semicircle_perimeter(radius)
- ellipse_area(a, b), ellipse_perimeter(a, b) (Ramanujan approximation)
- square_perimeter(side), square_area(side)
- rectangle_perimeter(length, width), rectangle_area(length, width)
- parallelogram_perimeter(base, side), parallelogram_area(base, height)
- triangle_perimeter(a,b,c), triangle_area_heron(a,b,c), triangle_area_base_height(base,height)
- right_triangle_hypotenuse(a,b), right_triangle_area(a,b)
- equilateral_triangle_area(side), equilateral_triangle_perimeter(side)
- isosceles_triangle_area(base, equal_side)
- trapezoid_area(a,b,height), trapezoid_perimeter(a,b,c,d)
- rhombus_area_by_diagonals(d1,d2), rhombus_perimeter_from_diagonals(d1,d2)
- kite_area_by_diagonals(d1,d2), kite_perimeter(side1,side2)
- regular_polygon_perimeter(n_sides, side_length), regular_polygon_area(n_sides, side_length)
- convenience wrappers: regular_pentagon_area, regular_hexagon_area, regular_octagon_area
- annulus_area(R, r), annulus_perimeter(R, r)
- sector_area(radius, angle_degrees), sector_arc_length(radius, angle_degrees)

> There are many helpers; the above is a representative subset — see the source for the full list.

### 8. Volumes (representative list)
- cube_volume(side)
- cuboid_volume(length, width, height)
- sphere_volume(radius)
- hemisphere_volume(radius)
- cylinder_volume(radius, height)
- cone_volume(radius, height)
- frustum_cone_volume(r1, r2, height)
- pyramid_volume(base_area, height)
- square_pyramid_volume(side, height)
- rectangular_pyramid_volume(length, width, height)
- prism_volume(base_area, length)
- triangular_prism_volume(base, triangle_height, length)
- regular_tetrahedron_volume(side)
- ellipsoid_volume(a, b, c)
- torus_volume(R, r)
- hollow_cylinder_volume(R_outer, R_inner, height)

---

## Examples

Call functions directly:

```python
from functions import physics

# Area of a circle radius 3
area = physics.circle_area(3)
print(area)

# Sphere volume radius 1.2
vol = physics.sphere_volume(1.2)
print(vol)

# Kinematics: velocity
v = physics.calculate_velocity(100, 9.58)  # distance in meters, time in seconds
print(v)

# Temperature conversion
k = physics.convert_temperature(0, 'c', 'k')
print(k)
```

Call via MATH_LIB:

```python
from functions.library import MATH_LIB

MATH_LIB['circle_area'](3)
MATH_LIB['sphere_volume'](1.2)
MATH_LIB['calculate_force'](10, 9.8)
```

---

## Validation, Exceptions & Warnings

- Many functions validate inputs and raise ValueError or ZeroDivisionError where appropriate (e.g., time==0, volume==0, invalid triangle sides, inner radius >= outer radius for hollow cylinders).
- Temperature-to-Kelvin conversion warns (or prints in current implementation) if the computed Kelvin is negative — physically impossible but included for safety.

---

## Recommendations & Next steps

1. Add an explicit `__all__` list to functions/physics.py to precisely control the public API that library.py registers.
2. Add unit tests for new geometry and volume functions (pytest) covering edge cases and numerical accuracy (especially for Ramanujan ellipse perimeter and trig-based chord lengths).
3. Decide on a numeric policy: Decimal-only vs float-only vs mixed (current pragmatic mixed approach).
4. Document units for each function (SI units recommended) in docstrings or a reference table to avoid ambiguity.

---

If you want, I can:

- Add `__all__` to functions/physics.py and re-run the library registration to whitelist exactly the functions/constants you want exported.
- Add a pytest test suite for the new functions and register it under Python/ScientificCalculator/tests/
- Convert the module to float-only for performance (faster trig) or Decimal-only with mpmath for consistent high-precision trig.

— End of physics.md
