"""
library.py

Builds the calculator function library.
"""

from decimal import Decimal

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


MATH_LIB = {

    "sin": sin,
    "cos": cos,
    "tan": tan,

    "asin": asin,
    "acos": acos,
    "atan": atan,

    "sinh": sinh,
    "cosh": cosh,
    "tanh": tanh,

    "sqrt": sqrt,
    "cbrt": cbrt,
    "root": root,

    "ln": ln,
    "log": log,

    "factorial": factorial,

    "factors": factors,
    "factorization": factorization,

    "Decimal": Decimal,

    "pi": constants.PI,
}
