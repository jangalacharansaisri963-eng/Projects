"""
trig.py

Symbolic & Numeric Trigonometric engine using SymPy and Decimal.
"""

import math
import constants
from decimal import Decimal
import sympy as sp

# Define symbolic variable x for identity work
x_sym = sp.Symbol('x')


def to_radians(x):
    """Converts input to radians, respecting DEGREE_MODE."""
    if isinstance(x, str) and "π" in x:
        s = x.strip().replace(" ", "").replace("pi", "π")
        if s == "π": return sp.pi
        parts = s.split("π")
        num = int(parts[0]) if parts[0] not in ["", "+"] else (-1 if parts[0] == "-" else 1)
        den = int(parts[1][1:]) if len(parts) > 1 and parts[1].startswith("/") else 1
        return (num * sp.pi) / den

    val = sp.sympify(x)
    if getattr(constants, 'DEGREE_MODE', False):
        return val * sp.pi / 180
    return val


def from_radians(x):
    """Converts radians back to degrees if DEGREE_MODE is active."""
    val = sp.sympify(x)
    if getattr(constants, 'DEGREE_MODE', False):
        return val * 180 / sp.pi
    return val


def simplify_identity(expression_str):
    """
    Takes a trigonometric identity string (e.g., 'sin(x)**2 + cos(x)**2')
    and simplifies it using algebraic/trig rules.
    """
    expr = sp.sympify(expression_str)
    simplified = sp.simplify(expr)
    trig_simplified = sp.trigsimp(simplified)
    return trig_simplified


# ==============================================================================
# CORE TRIGONOMETRIC FUNCTIONS
# ==============================================================================

def sin(x):
    val = to_radians(x)
    result = sp.sin(val)
    return sp.simplify(result)


def cos(x):
    val = to_radians(x)
    result = sp.cos(val)
    return sp.simplify(result)


def tan(x):
    val = to_radians(x)
    result = sp.tan(val)
    return sp.simplify(result)


def asin(x):
    val = sp.sympify(x)
    result = sp.asin(val)
    return from_radians(result)


def acos(x):
    val = sp.sympify(x)
    result = sp.acos(val)
    return from_radians(result)


def atan(x):
    val = sp.sympify(x)
    result = sp.atan(val)
    return from_radians(result)


# ==============================================================================
# 20+ TRIGONOMETRIC IDENTITIES
# ==============================================================================

def identity_pythagorean_1():
    """sin^2(x) + cos^2(x) = 1"""
    return simplify_identity("sin(x)**2 + cos(x)**2")


def identity_pythagorean_2():
    """1 + tan^2(x) = sec^2(x)"""
    return simplify_identity("1 + tan(x)**2 - 1/cos(x)**2")


def identity_pythagorean_3():
    """1 + cot^2(x) = csc^2(x)"""
    return simplify_identity("1 + 1/tan(x)**2 - 1/sin(x)**2")


def identity_double_angle_sin(x=x_sym):
    """sin(2x) = 2 * sin(x) * cos(x)"""
    expr = sp.sin(2 * x)
    return sp.expand_trig(expr)


def identity_double_angle_cos_1(x=x_sym):
    """cos(2x) = cos^2(x) - sin^2(x)"""
    expr = sp.cos(2 * x)
    return sp.expand_trig(expr)


def identity_double_angle_cos_2(x=x_sym):
    """cos(2x) = 2*cos^2(x) - 1"""
    expr = sp.cos(2 * x)
    expanded = sp.expand_trig(expr)
    return sp.trigsimp(expanded.subs(sp.sin(x)**2, 1 - sp.cos(x)**2))


def identity_double_angle_cos_3(x=x_sym):
    """cos(2x) = 1 - 2*sin^2(x)"""
    expr = sp.cos(2 * x)
    expanded = sp.expand_trig(expr)
    return sp.trigsimp(expanded.subs(sp.cos(x)**2, 1 - sp.sin(x)**2))


def identity_half_angle_sin(x=x_sym):
    """sin^2(x/2) = (1 - cos(x)) / 2"""
    expr = sp.sin(x / 2)**2
    return sp.trigsimp(expr)


def identity_half_angle_cos(x=x_sym):
    """cos^2(x/2) = (1 + cos(x)) / 2"""
    expr = sp.cos(x / 2)**2
    return sp.trigsimp(expr)


def identity_angle_sum_sin():
    """sin(a + b) = sin(a)cos(b) + cos(a)sin(b)"""
    a, b = sp.symbols('a b')
    return sp.expand_trig(sp.sin(a + b))


def identity_angle_diff_sin():
    """sin(a - b) = sin(a)cos(b) - cos(a)sin(b)"""
    a, b = sp.symbols('a b')
    return sp.expand_trig(sp.sin(a - b))


def identity_angle_sum_cos():
    """cos(a + b) = cos(a)cos(b) - sin(a)sin(b)"""
    a, b = sp.symbols('a b')
    return sp.expand_trig(sp.cos(a + b))


def identity_angle_diff_cos():
    """cos(a - b) = cos(a)cos(b) + sin(a)sin(b)"""
    a, b = sp.symbols('a b')
    return sp.expand_trig(sp.cos(a - b))


def identity_sum_to_product_sin_sin(a=sp.Symbol('a'), b=sp.Symbol('b')):
    """sin(a) + sin(b) = 2 * sin((a+b)/2) * cos((a-b)/2)"""
    expr = sp.sin(a) + sp.sin(b)
    return sp.factor(expr)


def identity_sum_to_product_sin_sub(a=sp.Symbol('a'), b=sp.Symbol('b')):
    """sin(a) - sin(b) = 2 * cos((a+b)/2) * sin((a-b)/2)"""
    expr = sp.sin(a) - sp.sin(b)
    return sp.factor(expr)


def identity_sum_to_product_cos_cos(a=sp.Symbol('a'), b=sp.Symbol('b')):
    """cos(a) + cos(b) = 2 * cos((a+b)/2) * cos((a-b)/2)"""
    expr = sp.cos(a) + sp.cos(b)
    return sp.factor(expr)


def identity_product_to_sum_sin_cos(a=sp.Symbol('a'), b=sp.Symbol('b')):
    """2 * sin(a) * cos(b) = sin(a+b) + sin(a-b)"""
    expr = 2 * sp.sin(a) * sp.cos(b)
    return sp.expand_trig(expr)


def identity_cofunction_sin(x=x_sym):
    """sin(pi/2 - x) = cos(x)"""
    return sp.simplify(sp.sin(sp.pi / 2 - x))


def identity_cofunction_cos(x=x_sym):
    """cos(pi/2 - x) = sin(x)"""
    return sp.simplify(sp.cos(sp.pi / 2 - x))


def identity_even_odd_sin(x=x_sym):
    """sin(-x) = -sin(x)"""
    return sp.simplify(sp.sin(-x))
    
