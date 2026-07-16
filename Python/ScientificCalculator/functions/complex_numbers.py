"""
complex_numbers.py

Complex number functions.
"""

import math
import cmath


# ======================================
# Real Part
# ======================================

def real(z):

    return complex(z).real


# ======================================
# Imaginary Part
# ======================================

def imag(z):

    return complex(z).imag


# ======================================
# Conjugate
# ======================================

def conj(z):

    return complex(z).conjugate()


# ======================================
# Modulus
# ======================================

def mod(z):

    return abs(complex(z))


# ======================================
# Argument
# ======================================

def arg(z):

    angle = cmath.phase(
        complex(z)
    )

    return math.degrees(
        angle
    )


# ======================================
# Polar Form
# ======================================

def polar(z):

    z = complex(z)

    return (
        abs(z),
        math.degrees(
            cmath.phase(z)
        )
    )


# ======================================
# Rectangular Form
# ======================================

def rect(r, theta):

    theta = math.radians(theta)

    return cmath.rect(
        r,
        theta
    )


# ======================================
# CIS
# ======================================

def cis(theta):

    theta = math.radians(theta)

    return cmath.rect(
        1,
        theta
    )
