"""
constants.py

Shared calculator constants.
"""

from decimal import getcontext

from functions.constant_generators import (
    calculate_pi,
    calculate_e,
    calculate_phi,
    calculate_r15,
)


# ==========================================
# PRECISION SETTINGS
# ==========================================

DEFAULT_PRECISION = 20
PRECISE_PRECISION = 105

getcontext().prec = DEFAULT_PRECISION


# ==========================================
# ANGLE MODE
# ==========================================

DEGREE_MODE = True


# ==========================================
# MATHEMATICAL CONSTANTS
# ==========================================

PI = None
E = None
PHI = None
R15 = None


def _ensure_constants():
    global PI, E, PHI, R15
    if PI is None:
        PI = calculate_pi(DEFAULT_PRECISION)
    if E is None:
        E = calculate_e(DEFAULT_PRECISION)
    if PHI is None:
        PHI = calculate_phi(DEFAULT_PRECISION)
    if R15 is None:
        R15 = calculate_r15(DEFAULT_PRECISION)


_ensure_constants()


# ==========================================
# PHYSICAL CONSTANTS
# ==========================================

SPEED_OF_LIGHT = 299792458
SPEED_OF_LIGHT_APPROX = 3e8
PLANCKS_CONSTANT = 6.625e-34
AVAGADRO_NUMBER = 6.022e23


# ==========================================
# CONSTANT GETTERS
# ==========================================

def get_pi():
    return PI


def get_e():
    return E


def get_phi():
    return PHI


def get_r15():
    return R15


# ==========================================
# DIGIT HELPERS
# ==========================================

def pi_digits(digits):
    return calculate_pi(digits)


def e_digits(digits):
    return calculate_e(digits)


def phi_digits(digits):
    return calculate_phi(digits)


def r15_digits(digits):
    return calculate_r15(digits)


# ==========================================
# DEBUG
# ==========================================

if __name__ == "__main__":

    print("Constants loaded successfully.\n")

    print("PI =", PI)
    print("E =", E)
    print("PHI =", PHI)
    print("R15 =", R15)

    print("\nFirst 25 digits:")

    print("PI  :", pi_digits(25))
    print("E   :", e_digits(25))
    print("PHI :", phi_digits(25))
    print("R15 :", r15_digits(25))
