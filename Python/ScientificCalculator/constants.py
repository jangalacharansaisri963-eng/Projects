"""
constants.py

Shared calculator constants.
"""

from decimal import Decimal, getcontext


# ==========================================
# PRECISION SETTINGS
# ==========================================

DEFAULT_PRECISION = 20
PRECISE_PRECISION = 105
MAX_CONSTANT_DIGITS = 100

getcontext().prec = DEFAULT_PRECISION


# ==========================================
# ANGLE MODE
# ==========================================

DEGREE_MODE = True


# ==========================================
# PI (100 DIGITS)
# ==========================================

PI = Decimal(
    "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679"
)


# ==========================================
# EULER'S NUMBER (100 DIGITS)
# ==========================================

E = Decimal(
    "2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274"
)


# ==========================================
# GOLDEN RATIO (100 DIGITS)
# ==========================================

PHI = Decimal(
    "1.6180339887498948482045868343656381177203091798057628621354486227052604628189024497072072041893911374"
)


# ==========================================
# SPEED OF LIGHT
# ==========================================

SPEED_OF_LIGHT = Decimal("299792458")
SPEED_OF_LIGHT_APPROX = Decimal("3e8")


# ==========================================
# RISHON'S CONSTANT (100 DIGITS)
# ==========================================

R15 = Decimal(
    "1.1383899949716618609749584590092419029779284015366000825822821452853382117148409656236077604283187278"
)


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
# DIGIT EXTRACTION
# ==========================================

def get_digits(value, digits):

    if not isinstance(digits, int):
        raise TypeError("digits must be an integer.")

    if digits < 0:
        raise ValueError("digits cannot be negative.")

    if digits > MAX_CONSTANT_DIGITS:
        raise ValueError(
            f"Maximum supported digits is {MAX_CONSTANT_DIGITS}."
        )

    integer, decimal = format(value, "f").split(".")

    return Decimal(
        integer + "." + decimal[:digits]
    )


# ==========================================
# DIGIT HELPERS
# ==========================================

def pi_digits(digits):
    return get_digits(PI, digits)


def e_digits(digits):
    return get_digits(E, digits)


def phi_digits(digits):
    return get_digits(PHI, digits)


def r15_digits(digits):
    return get_digits(R15, digits)


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
