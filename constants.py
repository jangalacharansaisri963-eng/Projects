"""
constants.py

Shared calculator constants.
"""

from decimal import Decimal, getcontext


# ==========================================
# DEFAULT PRECISION
# ==========================================

DEFAULT_PRECISION = 15
PRECISE_PRECISION = 105

getcontext().prec = DEFAULT_PRECISION


# ==========================================
# ANGLE MODE
# ==========================================

DEGREE_MODE = True


# ==========================================
# HIGH PRECISION PI
# ==========================================

def get_pi():

    old = getcontext().prec
    getcontext().prec += 10

    three = Decimal(3)

    last = Decimal(0)

    t = three

    n = Decimal(1)
    na = Decimal(0)

    d = Decimal(0)
    da = Decimal(24)

    while t != last:

        last = t

        n += na
        na += 8

        d += da
        da += 32

        t += n / d

    getcontext().prec = old

    return +t


PI = get_pi()


# ==========================================
# E CONSTANT
# ==========================================

def get_e():

    old = getcontext().prec
    getcontext().prec += 10

    e = Decimal(1)
    factorial = Decimal(1)

    for n in range(1, 200):

        factorial *= n

        term = Decimal(1) / factorial

        e += term

        if term < Decimal("1e-115"):
            break

    getcontext().prec = old

    return +e


E = get_e()


# ==========================================
# EXTRA SCIENTIFIC CONSTANTS
# ==========================================

# Golden ratio
PHI = Decimal("1.6180339887498948482")


# Speed of light in vacuum (m/s)
SPEED_OF_LIGHT = Decimal("299792458")
SPEED_OF_LIGHT_APPROX = Decimal("3e8")


# ==========================================
# RISHON'S CONSTANT (R15)
# ==========================================

def get_r15():

    old = getcontext().prec
    getcontext().prec += 10

    r15 = Decimal(0)

    for n in range(1, 200):

        term = Decimal(1) / (Decimal(n) ** (n + 1))

        r15 += term

        if term < Decimal("1e-115"):
            break

    getcontext().prec = old

    return +r15


R15 = get_r15()
