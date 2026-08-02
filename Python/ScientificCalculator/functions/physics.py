import math
from decimal import Decimal, getcontext

# Set precision for Decimal operations
getcontext().prec = 28

# ==============================================================================
# 0. BASIC MECHANICS & PARTICLES (PRECISION ALIGNED)
# ==============================================================================

def pressure(force, area):
    return Decimal(str(force)) / Decimal(str(area))

def area(force, pressure):
    return Decimal(str(force)) / Decimal(str(pressure))

def volume(length):
    side = Decimal(str(length))
    return side ** 3

def energy(h, frequency):
    # Enforces your explicit 6.625e-34 tracking value
    return Decimal('6.625e-34') * Decimal(str(frequency))

def frequency(energy, h):
    return Decimal(str(energy)) / Decimal('6.625e-34')

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

    fractional_rev = rev % Decimal('1')

    if fractional_rev == Decimal('0'):
        return Decimal('0')
    if fractional_rev == Decimal('0.5'):
        return Decimal('2') * rad
    if fractional_rev in [Decimal('0.25'), Decimal('0.75')]:
        return Decimal('2').sqrt() * rad
        
    angle_half_radians = float(rev * Decimal(str(math.pi)))
    sin_value = Decimal(str(math.sin(angle_half_radians)))
    return Decimal('2') * rad * abs(sin_value)


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
# 6. MIGRATED FUNCTIONS FROM BASIC_MATH (UPGRADED TO DECIMAL ENGINE)
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
    """
    Renamed from 'volume' to prevent overriding the geometric volume(length) function.
    """
    d = Decimal(str(density))
    if d == Decimal('0'):
        raise ZeroDivisionError("Density cannot be zero.")
    return Decimal(str(mass)) / d

                                
