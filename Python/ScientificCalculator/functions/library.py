"""
library.py

Builds the calculator function library.
"""

from decimal import Decimal
from fractions import Fraction

import constants

from functions.trig import (
    sin,
    cos,
    tan,
    asin,
    acos,
    atan,
)

from functions.complex_numbers import (
    real,
    imag,
    conj,
    mod,
    arg,
    polar,
    rect,
    cis,
)

from functions.hyperbolic import (
    sinh,
    cosh,
    tanh,
)

from functions.basic_math import (
    square,
    cube,
    reciprocal,
    lerp,
    is_even,
    is_odd,
    is_prime,
    next_prime,
    previous_prime,
    prime_factors,
    factor_count,
    digit_sum,
    digit_product,
    reverse_number,
)

from functions.roots import (
    sqrt,
    cbrt,
    root,
)

from functions.logarithms import (
    ln,
    log,
)

from functions.factorial import factorial

from functions.factors import (
    factors,
    factorization,
)

from functions.integers import (
    gcd,
    lcm,
)

from functions.simplify import simplify

from functions.compare import (
    compare,
    compare3,
    less,
    greater,
    equal,
    not_equal,
    less_equal,
    greater_equal,
    AO,
    DO,
    greatest,
    least,
)


MATH_LIB = {

    # ======================================
    # Trigonometry
    # ======================================

    "sin": sin,
    "cos": cos,
    "tan": tan,

    "asin": asin,
    "acos": acos,
    "atan": atan,

    "sinh": sinh,
    "cosh": cosh,
    "tanh": tanh,

    # ======================================
    # Roots
    # ======================================

    "sqrt": sqrt,
    "cbrt": cbrt,
    "root": root,

    # ======================================
    # Complex Numbers
    # ======================================

    "real": real,
    "imag": imag,

    "conj": conj,

    "mod": mod,
    "arg": arg,

    "polar": polar,
    "rect": rect,

    "cis": cis,

    # ======================================
    # Imaginary Numbers
    # ======================================

    "i": 1j,
    "j": 1j,
    
    # ======================================
    # Basic Mathematics
    # ======================================

    "square": square,
    "cube": cube,
    "reciprocal": reciprocal,
    "lerp": lerp,

    "is_even": is_even,
    "is_odd": is_odd,

    "is_prime": is_prime,
    "next_prime": next_prime,
    "previous_prime": previous_prime,

    "prime_factors": prime_factors,
    "factor_count": factor_count,

    "digit_sum": digit_sum,
    "digit_product": digit_product,

    "reverse_number": reverse_number,

    # ======================================
    # Logarithms
    # ======================================

    "ln": ln,
    "log": log,

    # ======================================
    # Factorial
    # ======================================

    "factorial": factorial,

    # ======================================
    # Factors
    # ======================================

    "factors": factors,
    "factorization": factorization,

    # ======================================
    # Integers
    # ======================================

    "gcd": gcd,
    "hcf": gcd,
    "lcm": lcm,

    # ======================================
    # Fractions
    # ======================================

    "simplify": simplify,

    # ======================================
    # Comparison
    # ======================================

    "compare": compare,
    "compare3": compare3,

    "less": less,
    "greater": greater,

    "equal": equal,
    "not_equal": not_equal,

    "less_equal": less_equal,
    "greater_equal": greater_equal,

    "AO": AO,
    "DO": DO,

    "greatest": greatest,
    "least": least,

    # ======================================
    # Built-in Types
    # ======================================

    "Decimal": Decimal,
    "Fraction": Fraction,

    # ======================================
    # Mathematical Constants
    # ======================================

    "pi": constants.PI,
    "PI": constants.PI,

    "e": constants.E,
    "E": constants.E,

    "phi": constants.PHI,
    "PHI": constants.PHI,

    "r15": constants.R15,
    "R15": constants.R15,

    # ======================================
    # Physical Constants
    # ======================================

    "c": constants.SPEED_OF_LIGHT,
    "c_approx": constants.SPEED_OF_LIGHT_APPROX,

    # ======================================
    # Constant Helpers
    # ======================================

    "pi_digits": constants.pi_digits,
    "e_digits": constants.e_digits,
    "phi_digits": constants.phi_digits,
    "r15_digits": constants.r15_digits,

}
