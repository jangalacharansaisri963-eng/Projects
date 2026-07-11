"""
engine.py

Expression evaluation.
"""

from decimal import getcontext

import constants

from parser import inject_implicit_mul

from functions.library import MATH_LIB


def evaluate(expression, precise=False):

    if precise:
        getcontext().prec = constants.PRECISE_PRECISION
    else:
        getcontext().prec = constants.DEFAULT_PRECISION

    constants.PI = constants.get_pi()

    MATH_LIB["pi"] = constants.PI

    expression = inject_implicit_mul(expression)

    return eval(
        expression,
        {"__builtins__": None},
        MATH_LIB,
    )
