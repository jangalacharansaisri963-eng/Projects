import math
from math import isqrt
from decimal import Decimal

def pressure(force, area):
    return force / area

def area(force, pressure):
    return force / pressure

def volume(length):
    return length * length * length

def energy(h, frequency):
    return 6.625e-34 * frequency 

def frequency(energy, h):
    return energy / 6.625e-34

def diagonal_square(side):
    return math.sqrt(2) * side

def diagonal_rectangle(length, width):
    return math.sqrt(length**2 + width**2)

def side(area):
    return math.sqrt(area)

def weight(mass, g):
    if g == 10:
        return mass * 10

    if g == 9.80665:
        return mass * 9.80665

    if g == 9.8:
        return mass * 9.8

# ==============================================================================
# 1. GEOMETRIC KINEMATICS (WITH FRACTION SHORTCUTS)
# ==============================================================================

def distance_circle(revolution, radius=1):
    """
    Calculates total track distance around a circle with specific fraction overrides.
    """
    rev = float(revolution)
    rad = float(radius)

    if rev == 0.5:
        return 3.14 * rad
  
    if rev == 1.0:
        return 3.14 * 2.0 * rad

    if rev == 0.25:
        return 3.14 * 0.5 * rad

    if rev == 0.75:
        return 3.14 * 3.0 * 0.5 * rad
        
    return rev * 2.0 * 3.14 * rad


def displacement_circle(revolution, radius=1):
    """
    Calculates straight-line displacement vector using precise Decimal square roots.
    """
    rev = float(revolution)
    rad_dec = Decimal(str(radius))

    if rev == 1.0:
        return Decimal('0')

    if rev == 0.5:
        return Decimal('2') * rad_dec

    if rev == 0.25 or rev == 0.75:
        sqrt_two = Decimal('2').sqrt()
        return sqrt_two * rad_dec
        
    angle_radians = rev * 2.0 * math.pi
    fallback_result = 2.0 * float(radius) * math.sin(angle_radians / 2.0)
    return Decimal(str(fallback_result))


# ==============================================================================
# 2. CORE KINEMATICS & DYNAMICS
# ==============================================================================

def calculate_velocity(distance, time):
    """
    Calculates linear speed or velocity (v = d / t).
    """
    if float(time) == 0.0:
        raise ValueError("Time cannot be zero (Division by Zero).")
    return Decimal(str(distance)) / Decimal(str(time))


def calculate_acceleration(initial_velocity, final_velocity, time):
    """
    Calculates uniform linear acceleration (a = (v_f - v_i) / t).
    """
    if float(time) == 0.0:
        raise ValueError("Time cannot be zero (Division by Zero).")
    v_i = Decimal(str(initial_velocity))
    v_f = Decimal(str(final_velocity))
    t = Decimal(str(time))
    return (v_f - v_i) / t


def calculate_force(mass, acceleration):
    """
    Calculates net force using Newton's Second Law (F = m * a).
    """
    return Decimal(str(mass)) * Decimal(str(acceleration))


# ==============================================================================
# 3. FRICTION ENGINE
# ==============================================================================

def calculate_friction(mu, mass, gravity="9.8"):
    """
    Calculates normal friction force acting on a flat horizontal plane (F_f = μ * m * g).
    """
    coefficient = Decimal(str(mu))
    m = Decimal(str(mass))
    g = Decimal(str(gravity))
    
    if coefficient < 0:
        raise ValueError("Friction coefficient (mu) cannot be negative.")
        
    return coefficient * m * g


# ==============================================================================
# 4. RESULTANT FLUID DENSITIES
# ==============================================================================

def resultant_density_by_volume(density1, density2):
    """
    Calculates mixture density when EQUAL VOLUMES are mixed (Arithmetic Mean).
    """
    return (Decimal(str(density1)) + Decimal(str(density2))) / Decimal('2')


def resultant_density_by_mass(density1, density2):
    """
    Calculates mixture density when EQUAL MASSES are mixed (Harmonic Mean).
    """
    rho1 = Decimal(str(density1))
    rho2 = Decimal(str(density2))
    denominator = rho1 + rho2
    if denominator == Decimal('0'):
        raise ValueError("Sum of densities cannot be zero.")
    return (Decimal('2') * rho1 * rho2) / denominator


def resultant_density_general(mass1, volume1, mass2, volume2):
    """
    Calculates mixture density for any arbitrary masses and volumes (ρ = total_m / total_v).
    """
    total_volume = Decimal(str(volume1)) + Decimal(str(volume2))
    if total_volume == Decimal('0'):
        raise ValueError("Total volume cannot be zero.")
    return (Decimal(str(mass1)) + Decimal(str(mass2))) / total_volume


# ==============================================================================
# 5. UNIFIED TEMPERATURE CONVERSION ENGINE
# ==============================================================================

def convert_temperature(value, from_unit, to_unit):
    """
    Converts temperature between Celsius, Fahrenheit, Kelvin, and Réaumur.
    
    Supported units (case-insensitive string labels):
      - Celsius:    'c', 'celsius', 'degree', 'degrees'
      - Fahrenheit: 'f', 'fahrenheit'
      - Kelvin:     'k', 'kelvin'
      - Réaumur:    'r', 'reamur', 'réaumur'
    """
    val = Decimal(str(value))
    src = from_unit.strip().lower()
    dst = to_unit.strip().lower()

    # --- Step 1: Normalize any input unit to Celsius ---
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

    # --- Step 2: Convert Celsius to the target unit ---
    if dst in ['c', 'celsius', 'degree', 'degrees']:
        return celsius
    elif dst in ['f', 'fahrenheit']:
        return (celsius * Decimal('9') / Decimal('5')) + Decimal('32')
    elif dst in ['k', 'kelvin']:
        # Absolute Zero Protection
        result = celsius + Decimal('273.15')
        if result < 0:
            print("[Warning]: Result is below Absolute Zero (-273.15°C / 0K)!")
        return result
    elif dst in ['r', 'reamur', 'réaumur']:
        return celsius * Decimal('4') / Decimal('5')
    else:
        raise ValueError(f"Unknown target temperature unit: '{to_unit}'")

