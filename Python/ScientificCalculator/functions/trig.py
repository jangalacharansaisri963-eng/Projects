"""
trig.py

Symbolic & Numeric Trigonometric engine using SymPy and Decimal.
Expanded with reciprocal functions, inverse co-functions, hyperbolic variants, 
and over 40 advanced trigonometric identities.
"""

import math
import constants
from decimal import Decimal
import sympy as sp

# Define symbolic variables for identity work
x_sym = sp.Symbol('x')
y_sym = sp.Symbol('y')


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
# CORE & RECIPROCAL TRIGONOMETRIC FUNCTIONS
# ==============================================================================

def sin(x):
    val = to_radians(x)
    return sp.simplify(sp.sin(val))


def cos(x):
    val = to_radians(x)
    return sp.simplify(sp.cos(val))


def tan(x):
    val = to_radians(x)
    return sp.simplify(sp.tan(val))


def sec(x):
    """Secant function: sec(x) = 1 / cos(x)"""
    val = to_radians(x)
    return sp.simplify(1 / sp.cos(val))


def csc(x):
    """Cosecant function: csc(x) = 1 / sin(x)"""
    val = to_radians(x)
    return sp.simplify(1 / sp.sin(val))


def cot(x):
    """Cotangent function: cot(x) = 1 / tan(x)"""
    val = to_radians(x)
    return sp.simplify(1 / sp.tan(val))


def asin(x):
    val = sp.sympify(x)
    return from_radians(sp.asin(val))


def acos(x):
    val = sp.sympify(x)
    return from_radians(sp.acos(val))


def atan(x):
    val = sp.sympify(x)
    return from_radians(sp.atan(val))


def asec(x):
    """Inverse secant: asec(x) = acos(1/x)"""
    val = sp.sympify(x)
    return from_radians(sp.acos(1 / val))


def acsc(x):
    """Inverse cosecant: acsc(x) = asin(1/x)"""
    val = sp.sympify(x)
    return from_radians(sp.asin(1 / val))


def acot(x):
    """Inverse cotangent: acot(x) = atan(1/x)"""
    val = sp.sympify(x)
    return from_radians(sp.atan(1 / val))


# ==============================================================================
# 40+ TRIGONOMETRIC IDENTITIES
# ==============================================================================

def identity_pythagorean_1():
    """1. sin^2(x) + cos^2(x) = 1"""
    return simplify_identity("sin(x)**2 + cos(x)**2 - 1")


def identity_pythagorean_2():
    """2. 1 + tan^2(x) = sec^2(x)"""
    return simplify_identity("1 + tan(x)**2 - 1/cos(x)**2")


def identity_pythagorean_3():
    """3. 1 + cot^2(x) = csc^2(x)"""
    return simplify_identity("1 + 1/tan(x)**2 - 1/sin(x)**2")


def identity_double_angle_sin(x=x_sym):
    """4. sin(2x) = 2 * sin(x) * cos(x)"""
    expr = sp.sin(2 * x)
    return sp.expand_trig(expr)


def identity_double_angle_cos_1(x=x_sym):
    """5. cos(2x) = cos^2(x) - sin^2(x)"""
    expr = sp.cos(2 * x)
    return sp.expand_trig(expr)


def identity_double_angle_cos_2(x=x_sym):
    """6. cos(2x) = 2*cos^2(x) - 1"""
    expr = sp.cos(2 * x)
    expanded = sp.expand_trig(expr)
    return sp.trigsimp(expanded.subs(sp.sin(x)**2, 1 - sp.cos(x)**2))


def identity_double_angle_cos_3(x=x_sym):
    """7. cos(2x) = 1 - 2*sin^2(x)"""
    expr = sp.cos(2 * x)
    expanded = sp.expand_trig(expr)
    return sp.trigsimp(expanded.subs(sp.cos(x)**2, 1 - sp.sin(x)**2))


def identity_double_angle_tan(x=x_sym):
    """8. tan(2x) = 2*tan(x) / (1 - tan^2(x))"""
    expr = sp.tan(2 * x)
    return sp.expand_trig(expr)


def identity_half_angle_sin(x=x_sym):
    """9. sin^2(x/2) = (1 - cos(x)) / 2"""
    expr = sp.sin(x / 2)**2
    return sp.trigsimp(expr)


def identity_half_angle_cos(x=x_sym):
    """10. cos^2(x/2) = (1 + cos(x)) / 2"""
    expr = sp.cos(x / 2)**2
    return sp.trigsimp(expr)


def identity_angle_sum_sin():
    """11. sin(a + b) = sin(a)cos(b) + cos(a)sin(b)"""
    a, b = sp.symbols('a b')
    return sp.expand_trig(sp.sin(a + b))


def identity_angle_diff_sin():
    """12. sin(a - b) = sin(a)cos(b) - cos(a)sin(b)"""
    a, b = sp.symbols('a b')
    return sp.expand_trig(sp.sin(a - b))


def identity_angle_sum_cos():
    """13. cos(a + b) = cos(a)cos(b) - sin(a)sin(b)"""
    a, b = sp.symbols('a b')
    return sp.expand_trig(sp.cos(a + b))


def identity_angle_diff_cos():
    """14. cos(a - b) = cos(a)cos(b) + sin(a)sin(b)"""
    a, b = sp.symbols('a b')
    return sp.expand_trig(sp.cos(a - b))


def identity_angle_sum_tan():
    """15. tan(a + b) = (tan(a) + tan(b)) / (1 - tan(a)tan(b))"""
    a, b = sp.symbols('a b')
    return sp.expand_trig(sp.tan(a + b))


def identity_sum_to_product_sin_sin(a=sp.Symbol('a'), b=sp.Symbol('b')):
    """16. sin(a) + sin(b) = 2 * sin((a+b)/2) * cos((a-b)/2)"""
    expr = sp.sin(a) + sp.sin(b)
    return sp.factor(expr)


def identity_sum_to_product_sin_sub(a=sp.Symbol('a'), b=sp.Symbol('b')):
    """17. sin(a) - sin(b) = 2 * cos((a+b)/2) * sin((a-b)/2)"""
    expr = sp.sin(a) - sp.sin(b)
    return sp.factor(expr)


def identity_sum_to_product_cos_cos(a=sp.Symbol('a'), b=sp.Symbol('b')):
    """18. cos(a) + cos(b) = 2 * cos((a+b)/2) * cos((a-b)/2)"""
    expr = sp.cos(a) + sp.cos(b)
    return sp.factor(expr)


def identity_product_to_sum_sin_cos(a=sp.Symbol('a'), b=sp.Symbol('b')):
    """19. 2 * sin(a) * cos(b) = sin(a+b) + sin(a-b)"""
    expr = 2 * sp.sin(a) * sp.cos(b)
    return sp.expand_trig(expr)


def identity_cofunction_sin(x=x_sym):
    """20. sin(pi/2 - x) = cos(x)"""
    return sp.simplify(sp.sin(sp.pi / 2 - x))


def identity_cofunction_cos(x=x_sym):
    """21. cos(pi/2 - x) = sin(x)"""
    return sp.simplify(sp.cos(sp.pi / 2 - x))


def identity_even_odd_sin(x=x_sym):
    """22. sin(-x) = -sin(x)"""
    return sp.simplify(sp.sin(-x))


def identity_even_odd_cos(x=x_sym):
    """23. cos(-x) = cos(x)"""
    return sp.simplify(sp.cos(-x))


def identity_triple_angle_sin(x=x_sym):
    """24. sin(3x) = 3*sin(x) - 4*sin^3(x)"""
    expr = sp.sin(3 * x)
    return sp.expand_trig(expr)


# --- 20 Additional Advanced Trigonometric Identities ---

def identity_triple_angle_cos(x=x_sym):
    """25. cos(3x) = 4*cos^3(x) - 3*cos(x)"""
    expr = sp.cos(3 * x)
    return sp.expand_trig(expr)


def identity_triple_angle_tan(x=x_sym):
    """26. tan(3x) = (3*tan(x) - tan^3(x)) / (1 - 3*tan^2(x))"""
    expr = sp.tan(3 * x)
    return sp.expand_trig(expr)


def identity_half_angle_tan(x=x_sym):
    """27. tan^2(x/2) = (1 - cos(x)) / (1 + cos(x))"""
    expr = sp.tan(x / 2)**2
    return sp.trigsimp(expr)


def identity_angle_diff_tan():
    """28. tan(a - b) = (tan(a) - tan(b)) / (1 + tan(a)tan(b))"""
    a, b = sp.symbols('a b')
    return sp.expand_trig(sp.tan(a - b))


def identity_sum_to_product_cos_sub(a=sp.Symbol('a'), b=sp.Symbol('b')):
    """29. cos(a) - cos(b) = -2 * sin((a+b)/2) * sin((a-b)/2)"""
    expr = sp.cos(a) - sp.cos(b)
    return sp.factor(expr)


def identity_product_to_sum_cos_sin(a=sp.Symbol('a'), b=sp.Symbol('b')):
    """30. 2 * cos(a) * sin(b) = sin(a+b) - sin(a-b)"""
    expr = 2 * sp.cos(a) * sp.sin(b)
    return sp.expand_trig(expr)


def identity_product_to_sum_cos_cos(a=sp.Symbol('a'), b=sp.Symbol('b')):
    """31. 2 * cos(a) * cos(b) = cos(a+b) + cos(a-b)"""
    expr = 2 * sp.cos(a) * sp.cos(b)
    return sp.expand_trig(expr)


def identity_product_to_sum_sin_sin(a=sp.Symbol('a'), b=sp.Symbol('b')):
    """32. -2 * sin(a) * sin(b) = cos(a+b) - cos(a-b)"""
    expr = -2 * sp.sin(a) * sp.sin(b)
    return sp.expand_trig(expr)


def identity_even_odd_tan(x=x_sym):
    """33. tan(-x) = -tan(x)"""
    return sp.simplify(sp.tan(-x))


def identity_cofunction_tan(x=x_sym):
    """34. tan(pi/2 - x) = cot(x)"""
    return sp.simplify(sp.tan(sp.pi / 2 - x))


def identity_cofunction_sec(x=x_sym):
    """35. sec(pi/2 - x) = csc(x)"""
    return sp.simplify(1 / sp.cos(sp.pi / 2 - x))


def identity_cofunction_csc(x=x_sym):
    """36. csc(pi/2 - x) = sec(x)"""
    return sp.simplify(1 / sp.sin(sp.pi / 2 - x))


def identity_cofunction_cot(x=x_sym):
    """37. cot(pi/2 - x) = tan(x)"""
    return sp.simplify(1 / sp.tan(sp.pi / 2 - x))


def identity_power_reduction_sin(x=x_sym):
    """38. sin^2(x) = (1 - cos(2x)) / 2"""
    expr = sp.sin(x)**2
    return sp.trigsimp(expr)


def identity_power_reduction_cos(x=x_sym):
    """39. cos^2(x) = (1 + cos(2x)) / 2"""
    expr = sp.cos(x)**2
    return sp.trigsimp(expr)


def identity_power_reduction_tan(x=x_sym):
    """40. tan^2(x) = (1 - cos(2x)) / (1 + cos(2x))"""
    expr = sp.tan(x)**2
    return sp.trigsimp(expr)


def identity_bhagavata_sum(a=sp.Symbol('a'), b=sp.Symbol('b')):
    """41. sin(a+b) * sin(a-b) = sin^2(a) - sin^2(b)"""
    expr = sp.sin(a + b) * sp.sin(a - b)
    return sp.expand_trig(expr)


def identity_bhagavata_sum_cos(a=sp.Symbol('a'), b=sp.Symbol('b')):
    """42. cos(a+b) * cos(a-b) = cos^2(a) - sin^2(b)"""
    expr = sp.cos(a + b) * sp.cos(a - b)
    return sp.expand_trig(expr)


def identity_quadruple_angle_sin(x=x_sym):
    """43. sin(4x) = 4*sin(x)*cos(x) * (1 - 2*sin^2(x))"""
    expr = sp.sin(4 * x)
    return sp.expand_trig(expr)


def identity_quadruple_angle_cos(x=x_sym):
    """44. cos(4x) = 8*cos^4(x) - 8*cos^2(x) + 1"""
    expr = sp.cos(4 * x)
    return sp.expand_trig(expr)
    
