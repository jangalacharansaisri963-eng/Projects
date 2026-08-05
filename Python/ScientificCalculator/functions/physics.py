import math
from decimal import Decimal, getcontext
from fractions import Fraction

# Set precision for Decimal operations
getcontext().prec = 28

# Provide a named Planck constant (CODATA recommended value)
PLANCK_CONSTANT = Decimal('6.62607015e-34')

# ==============================================================================
# 0. BASIC MECHANICS & PARTICLES (PRECISION ALIGNED)
# ==============================================================================

def pressure(force, area):
    return Decimal(str(force)) / Decimal(str(area))


def boltzman_entropy(microstates: int) -> Decimal:
    """Calculates exact Boltzmann entropy using Decimal for precision.
    
    Formula: S = k_B * ln(Ω)
    """
    if microstates <= 0:
        raise ValueError("Microstates must be greater than zero.")
        
    k_B = Decimal("1.380649e-23")  # Boltzmann constant
    Ω = Decimal(str(microstates))    # Using Ω (Omega) to represent microstates
    
    return k_B * Ω.ln()


def radians(degrees):
    deg = int(degrees)
    frac = Fraction(deg, 180)
    
    num = frac.numerator
    den = frac.denominator
    
    if num == 0:
        return "0"
        
    num_part = "" if num == 1 else str(num)
    den_part = "" if den == 1 else f"/{den}"
    
    return f"{num_part}π{den_part}"


def degrees(rad_str):
    s = str(rad_str).strip().replace(" ", "").replace("pi", "π")
    
    if "π" not in s:
        return float(s) * (180.0 / math.pi)
        
    if s == "π":
        return 180
    if s == "-π":
        return -180
        
    parts = s.split("π")
    coefficient_part = parts[0]
    denominator_part = parts[1] if len(parts) > 1 else ""
    
    if coefficient_part == "" or coefficient_part == "+":
        num = 1
    elif coefficient_part == "-":
        num = -1
    else:
        num = int(coefficient_part)
        
    if denominator_part.startswith("/"):
        den = int(denominator_part[1:])
    else:
        den = 1
        
    result = (Fraction(num, den)) * 180
    return float(result) if result.denominator != 1 else int(result)


def time_from_velocity(displacement, velocity):
    return Decimal(str(displacement)) / Decimal(str(velocity))


def time_from_work(work, force):
    return Decimal(str(work)) / Decimal(str(force))


def time_from_power(work, power):
    return Decimal(str(work)) / Decimal(str(power))
    

def gravitational_constant(force, distance, mass1, mass2):
    f_dec = Decimal(str(force))
    d_dec = Decimal(str(distance))
    m1_dec = Decimal(str(mass1))
    m2_dec = Decimal(str(mass2))
    
    denominator = m1_dec * m2_dec
    if denominator == Decimal('0'):
        raise ZeroDivisionError("Masses cannot be zero.")
        
    return (f_dec * (d_dec ** 2)) / denominator
    
                
def momentum(mass, velocity):
    return Decimal(str(mass)) * Decimal(str(velocity))

                
def gravitational_potential(force, displacement, mass):
    work = Decimal(str(force)) * Decimal(str(displacement))
    return work / Decimal(str(mass))


def displacement_hypotenuse(a, b):
    sum_of_squares = Decimal(str(a))**2 + Decimal(str(b))**2
    return sum_of_squares.sqrt()


def right_angled_adjacent(opposite, hypotenuse):
    diff_of_squares = Decimal(str(hypotenuse))**2 - Decimal(str(opposite))**2
    if diff_of_squares < 0:
        raise ValueError("Invalid dimensions: opposite side cannot be >= hypotenuse for a right triangle.")
    return diff_of_squares.sqrt()


def direction_of_displacement(dx, dy):
    dec_dx = Decimal(str(dx))
    dec_dy = Decimal(str(dy))
    angle_deg = math.degrees(math.atan2(float(dec_dy), float(dec_dx)))
    return Decimal(str(angle_deg))


def impulse(force, time):
    return Decimal(str(force)) * Decimal(str(time))


def latent_heat(heat_energy_joules, mass_kg):
    return Decimal(str(heat_energy_joules)) / Decimal(str(mass_kg))


def calorific_value(total_heat_joules, mass_kg):
    return Decimal(str(total_heat_joules)) / Decimal(str(mass_kg))


def heat_for_phase_change(mass_kg, latent_heat_constant):
    return Decimal(str(mass_kg)) * Decimal(str(latent_heat_constant))


def heat_from_combustion(mass_fuel_kg, calorific_value_constant):
    return Decimal(str(mass_fuel_kg)) * Decimal(str(calorific_value_constant))


def specific_heat_capacity(heat, mass, delta_temperature):
    mass_term = Decimal(str(mass)) * Decimal(str(delta_temperature))
    return Decimal(str(heat)) / mass_term


def heat_for_temperature_change(mass, specific_heat_constant, delta_temperature):
    return (Decimal(str(mass)) * Decimal(str(specific_heat_constant)) * Decimal(str(delta_temperature)))


def area(force, pressure):
    return Decimal(str(force)) / Decimal(str(pressure))


def volume(length):
    side = Decimal(str(length))
    return side ** 3


def energy(h, frequency):
    """E = h * f. Uses provided h or falls back to PLANCK_CONSTANT."""
    h_dec = Decimal(str(h)) if h is not None else PLANCK_CONSTANT
    return h_dec * Decimal(str(frequency))


def frequency(energy, h):
    """f = E / h. Uses provided h or falls back to PLANCK_CONSTANT."""
    h_dec = Decimal(str(h)) if h is not None else PLANCK_CONSTANT
    return Decimal(str(energy)) / h_dec


def diagonal_square(side):
    return Decimal(str(side)) * Decimal('2').sqrt()


def diagonal_rectangle(length, width):
    l_dec = Decimal(str(length))
    w_dec = Decimal(str(width))
    return (l_dec**2 + w_dec**2).sqrt()


def side(area):
    return Decimal(str(area)).sqrt()


def weight(mass, g):
    """Calculates weight (W = m * g)."""
    return Decimal(str(mass)) * Decimal(str(g))


# ==============================================================================
# 1. GEOMETRIC KINEMATICS
# ==============================================================================

def distance_circle(revolution, radius=1):
    """Calculates total path distance around a circle."""
    rev = Decimal(str(revolution))
    rad = Decimal(str(radius))
    pi_dec = Decimal(str(math.pi))
    return rev * Decimal('2') * pi_dec * rad


def displacement_circle(revolution, radius=1):
    """Calculates straight-line displacement chord using precise Decimals."""
    rev = Decimal(str(revolution))
    rad = Decimal(str(radius))

    fractional_rev = (rev % Decimal('1'))

    if fractional_rev == Decimal('0'):
        return Decimal('0')
    if fractional_rev == Decimal('0.5'):
        return Decimal('2') * rad
    if fractional_rev in [Decimal('0.25'), Decimal('0.75')]:
        return Decimal('2').sqrt() * rad

    angle = float(fractional_rev * Decimal(str(math.pi)))
    sin_value = Decimal(str(math.sin(angle)))
    return Decimal('2') * rad * abs(sin_value)


def chord_length_from_angle(radius, theta_degrees):
    """Calculates chord length using the formula: 2 * R * sin(theta / 2)."""
    r = Decimal(str(radius))
    theta = Decimal(str(theta_degrees))
    # Convert angle to radians for math.sin: (theta / 2) * (pi / 180)
    half_angle_rad = float(theta / Decimal('2') * Decimal(str(math.pi)) / Decimal('180'))
    sin_val = Decimal(str(math.sin(half_angle_rad)))
    return Decimal('2') * r * sin_val


# ==============================================================================
# 2. CORE KINEMATICS & DYNAMICS
# ==============================================================================

def calculate_velocity(distance, time):
    t = Decimal(str(time))
    if t == Decimal('0'):
        raise ZeroDivisionError("Time cannot be zero.")
    return Decimal(str(distance)) / t


def calculate_acceleration(initial_velocity, final_velocity, time):
    t = Decimal(str(time))
    if t == Decimal('0'):
        raise ZeroDivisionError("Time cannot be zero.")
    return (Decimal(str(final_velocity)) - Decimal(str(initial_velocity))) / t


def calculate_force(mass, acceleration):
    return Decimal(str(mass)) * Decimal(str(acceleration))


# ==============================================================================
# 3. FRICTION ENGINE
# ==============================================================================

def calculate_friction(mu, mass, gravity="9.80665"):
    coefficient = Decimal(str(mu))
    m = Decimal(str(mass))
    g = Decimal(str(gravity))

    if coefficient < 0:
        raise ValueError("Friction coefficient (mu) cannot be negative.")
    if m < 0:
        raise ValueError("Mass cannot be negative.")
    return coefficient * m * g


# ==============================================================================
# 4. RESULTANT FLUID DENSITIES
# ==============================================================================

def resultant_density_by_volume(density1, density2):
    return (Decimal(str(density1)) + Decimal(str(density2))) / Decimal('2')


def resultant_density_by_mass(density1, density2):
    rho1 = Decimal(str(density1))
    rho2 = Decimal(str(density2))
    denominator = rho1 + rho2
    if denominator == Decimal('0'):
        raise ZeroDivisionError("Sum of densities cannot be zero.")
    return (Decimal('2') * rho1 * rho2) / denominator


def resultant_density_general(mass1, volume1, mass2, volume2):
    total_volume = Decimal(str(volume1)) + Decimal(str(volume2))
    if total_volume == Decimal('0'):
        raise ZeroDivisionError("Total volume cannot be zero.")
    return (Decimal(str(mass1)) + Decimal(str(mass2))) / total_volume


# ==============================================================================
# 5. UNIFIED TEMPERATURE CONVERSION ENGINE
# ==============================================================================

def convert_temperature(value, from_unit, to_unit):
    val = Decimal(str(value))
    src = from_unit.strip().lower()
    dst = to_unit.strip().lower()

    if src in ['c', 'celsius', 'degree', 'degrees']:
        celsius = val
    elif src in ['f', 'fahrenheit']:
        celsius = (val - Decimal('32')) * Decimal('5') / Decimal('9')
    elif src in ['k', 'kelvin']:
        celsius = val - Decimal('273.15')
    elif src in ['r', 'reamur', 'réaumur']:
        celsius = val * Decimal('5') / Decimal('4')
    else:
        raise ValueError(f"Unknown source temperature unit: '{from_unit}'")

    if dst in ['c', 'celsius', 'degree', 'degrees']:
        return celsius
    elif dst in ['f', 'fahrenheit']:
        return (celsius * Decimal('9') / Decimal('5')) + Decimal('32')
    elif dst in ['k', 'kelvin']:
        result = celsius + Decimal('273.15')
        if result < Decimal('0'):
            print("[Warning]: Result is below Absolute Zero (0K)!")
        return result
    elif dst in ['r', 'reamur', 'réaumur']:
        return celsius * Decimal('4') / Decimal('5')
    else:
        raise ValueError(f"Unknown target temperature unit: '{to_unit}'")


# ==============================================================================
# 6. MIGRATED FUNCTIONS FROM BASIC_MATH
# ==============================================================================

def distance(speed, time):
    return Decimal(str(speed)) * Decimal(str(time))


def speed(distance, time):
    t = Decimal(str(time))
    if t == Decimal('0'):
        raise ZeroDivisionError("Time cannot be zero.")
    return Decimal(str(distance)) / t


def time(distance, speed):
    s = Decimal(str(speed))
    if s == Decimal('0'):
        raise ZeroDivisionError("Speed cannot be zero.")
    return Decimal(str(distance)) / s


def work(force, distance):
    return Decimal(str(force)) * Decimal(str(distance))


def power(work, time):
    t = Decimal(str(time))
    if t == Decimal('0'):
        raise ZeroDivisionError("Time cannot be zero.")
    return Decimal(str(work)) / t


def kineticenergy(mass, velocity):
    m = Decimal(str(mass))
    v = Decimal(str(velocity))
    return Decimal('0.5') * m * (v ** 2)


def potentialenergy(mass, gravity, height):
    m = Decimal(str(mass))
    g = Decimal(str(gravity))
    h = Decimal(str(height))
    return m * g * h


def density(mass, volume):
    v = Decimal(str(volume))
    if v == Decimal('0'):
        raise ZeroDivisionError("Volume cannot be zero.")
    return Decimal(str(mass)) / v


def mass(density, volume):
    return Decimal(str(density)) * Decimal(str(volume))


def volume_by_density(mass, density):
    d = Decimal(str(density))
    if d == Decimal('0'):
        raise ZeroDivisionError("Density cannot be zero.")
    return Decimal(str(mass)) / d

                                  
# ==============================================================================
# 7. PERIMETERS & AREAS (20+ SHAPES)
# ==============================================================================

PI_DEC = Decimal(str(math.pi))

def circle_circumference(radius):
    r = Decimal(str(radius))
    return Decimal('2') * PI_DEC * r

def circle_area(radius):
    r = Decimal(str(radius))
    return PI_DEC * (r ** 2)

def semicircle_area(radius):
    return circle_area(radius) / Decimal('2')

def semicircle_perimeter(radius):
    r = Decimal(str(radius))
    return PI_DEC * r + Decimal('2') * r

def ellipse_area(a, b):
    return PI_DEC * Decimal(str(a)) * Decimal(str(b))

def ellipse_perimeter(a, b):
    a_d = Decimal(str(a))
    b_d = Decimal(str(b))
    term = (Decimal('3') * (a_d + b_d) - ((Decimal('3') * a_d + b_d) * (a_d + Decimal('3') * b_d)).sqrt())
    return PI_DEC * term

def square_perimeter(side):
    s = Decimal(str(side))
    return Decimal('4') * s

def square_area(side):
    s = Decimal(str(side))
    return s ** 2

def rectangle_perimeter(length, width):
    l = Decimal(str(length))
    w = Decimal(str(width))
    return Decimal('2') * (l + w)

def rectangle_area(length, width):
    return Decimal(str(length)) * Decimal(str(width))

def parallelogram_perimeter(base, side):
    b = Decimal(str(base))
    s = Decimal(str(side))
    return Decimal('2') * (b + s)

def parallelogram_area(base, height):
    return Decimal(str(base)) * Decimal(str(height))

def triangle_perimeter(a, b, c):
    return Decimal(str(a)) + Decimal(str(b)) + Decimal(str(c))

def triangle_area_heron(a, b, c):
    a_d = Decimal(str(a))
    b_d = Decimal(str(b))
    c_d = Decimal(str(c))
    s = (a_d + b_d + c_d) / Decimal('2')
    inner = s * (s - a_d) * (s - b_d) * (s - c_d)
    if inner < 0:
        raise ValueError("Invalid triangle sides for area calculation (negative square root).")
    return inner.sqrt()

def triangle_area_base_height(base, height):
    return Decimal(str(base)) * Decimal(str(height)) / Decimal('2')

def right_triangle_hypotenuse(a, b):
    a_d = Decimal(str(a))
    b_d = Decimal(str(b))
    return (a_d**2 + b_d**2).sqrt()

def right_triangle_area(a, b):
    return Decimal(str(a)) * Decimal(str(b)) / Decimal('2')

def equilateral_triangle_area(side):
    s = Decimal(str(side))
    return (Decimal(str(math.sqrt(3))) / Decimal('4')) * (s ** 2)

def equilateral_triangle_perimeter(side):
    return Decimal('3') * Decimal(str(side))

def isosceles_triangle_area(base, equal_side):
    b = Decimal(str(base))
    s = Decimal(str(equal_side))
    inner = s**2 - (b**2 / Decimal('4'))
    if inner < 0:
        raise ValueError("Invalid dimensions for isosceles triangle (imaginary height).")
    h = inner.sqrt()
    return (b * h) / Decimal('2')

def trapezoid_area(a, b, height):
    return (Decimal(str(a)) + Decimal(str(b))) * Decimal(str(height)) / Decimal('2')

def trapezoid_perimeter(a, b, c, d):
    return Decimal(str(a)) + Decimal(str(b)) + Decimal(str(c)) + Decimal(str(d))

def rhombus_area_by_diagonals(d1, d2):
    return (Decimal(str(d1)) * Decimal(str(d2))) / Decimal('2')

def rhombus_perimeter_from_diagonals(d1, d2):
    half1 = (Decimal(str(d1)) / Decimal('2'))
    half2 = (Decimal(str(d2)) / Decimal('2'))
    side = (half1**2 + half2**2).sqrt()
    return Decimal('4') * side

def kite_area_by_diagonals(d1, d2):
    return (Decimal(str(d1)) * Decimal(str(d2))) / Decimal('2')

def kite_perimeter(side1, side2):
    return Decimal('2') * (Decimal(str(side1)) + Decimal(str(side2)))

def regular_polygon_perimeter(n_sides, side_length):
    n = Decimal(str(n_sides))
    s = Decimal(str(side_length))
    return n * s

def regular_polygon_area(n_sides, side_length):
    n = int(n_sides)
    s = float(side_length)
    apothem = s / (2.0 * math.tan(math.pi / n))
    area = 0.5 * n * s * apothem
    return Decimal(str(area))

def regular_pentagon_area(side):
    return regular_polygon_area(5, side)

def regular_pentagon_perimeter(side):
    return regular_polygon_perimeter(5, side)

def regular_hexagon_area(side):
    s = Decimal(str(side))
    return (Decimal('3') * Decimal(str(math.sqrt(3))) / Decimal('2')) * (s ** 2)

def regular_hexagon_perimeter(side):
    return Decimal('6') * Decimal(str(side))

def regular_octagon_area(side):
    s = Decimal(str(side))
    return Decimal('2') * (Decimal('1') + Decimal(str(math.sqrt(2)))) * (s ** 2)

def regular_octagon_perimeter(side):
    return Decimal('8') * Decimal(str(side))

def annulus_area(R, r):
    R_d = Decimal(str(R))
    r_d = Decimal(str(r))
    return PI_DEC * (R_d**2 - r_d**2)

def annulus_perimeter(R, r):
    R_d = Decimal(str(R))
    r_d = Decimal(str(r))
    return Decimal('2') * PI_DEC * (R_d + r_d)

def sector_area(radius, angle_degrees):
    r = Decimal(str(radius))
    theta = Decimal(str(angle_degrees)) * PI_DEC / Decimal('180')
    return (r ** 2) * theta / Decimal('2')

def sector_arc_length(radius, angle_degrees):
    r = Decimal(str(radius))
    theta = Decimal(str(angle_degrees)) * PI_DEC / Decimal('180')
    return r * theta


# ==============================================================================
# 8. VOLUMES (15+ SHAPES)
# ==============================================================================

def cube_volume(side):
    s = Decimal(str(side))
    return s ** 3

def cuboid_volume(length, width, height):
    return Decimal(str(length)) * Decimal(str(width)) * Decimal(str(height))

def sphere_volume(radius):
    r = Decimal(str(radius))
    return (Decimal('4') / Decimal('3')) * PI_DEC * (r ** 3)

def hemisphere_volume(radius):
    r = Decimal(str(radius))
    return (Decimal('2') / Decimal('3')) * PI_DEC * (r ** 3)

def cylinder_volume(radius, height):
    r = Decimal(str(radius))
    h = Decimal(str(height))
    return PI_DEC * (r ** 2) * h

def cone_volume(radius, height):
    r = Decimal(str(radius))
    h = Decimal(str(height))
    return (Decimal('1') / Decimal('3')) * PI_DEC * (r ** 2) * h

def frustum_cone_volume(r1, r2, height):
    R1 = Decimal(str(r1))
    R2 = Decimal(str(r2))
    h = Decimal(str(height))
    return (Decimal('1') / Decimal('3')) * PI_DEC * h * (R1**2 + R1*R2 + R2**2)

def pyramid_volume(base_area, height):
    return Decimal(str(base_area)) * Decimal(str(height)) / Decimal('3')

def square_pyramid_volume(side, height):
    base = Decimal(str(side)) ** 2
    return base * Decimal(str(height)) / Decimal('3')

def rectangular_pyramid_volume(length, width, height):
    base = Decimal(str(length)) * Decimal(str(width))
    return base * Decimal(str(height)) / Decimal('3')

def prism_volume(base_area, length):
    return Decimal(str(base_area)) * Decimal(str(length))

def triangular_prism_volume(base, height_of_triangle, length):
    base_area = Decimal(str(base)) * Decimal(str(height_of_triangle)) / Decimal('2')
    return base_area * Decimal(str(length))

def regular_tetrahedron_volume(side):
    s = Decimal(str(side))
    denom = Decimal('6') * Decimal(str(math.sqrt(2)))
    return s**3 / denom

def ellipsoid_volume(a, b, c):
    return (Decimal('4') / Decimal('3')) * PI_DEC * Decimal(str(a)) * Decimal(str(b)) * Decimal(str(c))

def torus_volume(R, r):
    R_d = Decimal(str(R))
    r_d = Decimal(str(r))
    return Decimal('2') * (PI_DEC ** 2) * R_d * (r_d ** 2)

def hollow_cylinder_volume(R_outer, R_inner, height):
    Ro = Decimal(str(R_outer))
    Ri = Decimal(str(R_inner))
    h = Decimal(str(height))
    if Ri >= Ro:
        raise ValueError("Inner radius must be smaller than outer radius.")
    return PI_DEC * h * (Ro**2 - Ri**2)
        
