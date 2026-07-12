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

from functions.hyperbolic import (
    sinh,
    cosh,
    tanh,
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

from functions.simplify import (
    simplify,
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
