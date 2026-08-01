"""
constant_generators.py

Algorithms for generating mathematical constants.
"""

from decimal import Decimal, getcontext


def calculate_pi(digits=None):
    """
    Compute π using the Gauss-Legendre algorithm.
    """
    old_prec = getcontext().prec
    if digits is not None:
        getcontext().prec = digits + 5  # Guard digits for rounding accuracy

    one = Decimal(1)
    two = Decimal(2)
    four = Decimal(4)

    a = one
    b = one / two.sqrt()
    t = Decimal("0.25")
    p = one

    while True:
        an = (a + b) / two
        bn = (a * b).sqrt()
        tn = t - p * (a - an) ** 2
        pn = two * p

        if an == a:
            break

        a, b, t, p = an, bn, tn, pn

    result = ((a + b) ** 2) / (four * t)
    
    if digits is not None:
        getcontext().prec = old_prec
        return +result  # Unary plus applies the original precision context
    return result


def calculate_e(digits=None):
    """
    Compute Euler's number using:

        e = Σ 1/n!
    """
    old_prec = getcontext().prec
    if digits is not None:
        getcontext().prec = digits + 5

    result = Decimal(0)
    factorial = 1
    n = 0

    while True:
        if n > 0:
            factorial *= n

        term = Decimal(1) / Decimal(factorial)

        if term == 0:
            break

        result += term
        n += 1

    if digits is not None:
        getcontext().prec = old_prec
        return +result
    return result


def calculate_phi(digits=None):
    """
    Golden ratio.
    """
    old_prec = getcontext().prec
    if digits is not None:
        getcontext().prec = digits + 5

    result = (Decimal(1) + Decimal(5).sqrt()) / Decimal(2)

    if digits is not None:
        getcontext().prec = old_prec
        return +result
    return result


def calculate_r15(digits=None):
    """
    R15 = Σ 1 / n^(n+1)
    """
    old_prec = getcontext().prec
    if digits is not None:
        getcontext().prec = digits + 5

    result = Decimal(0)
    n = 1

    while True:
        # Decimal values automatically respect current context precision limits
        denominator = Decimal(n) ** Decimal(n + 1)
        term = Decimal(1) / denominator

        if term == 0:
            break

        result += term
        n += 1

    if digits is not None:
        getcontext().prec = old_prec
        return +result
    return result

