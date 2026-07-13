"""
engine.py

Expression evaluation.
"""

from decimal import getcontext

import constants

from parser import preprocess

from functions.library import MATH_LIB
from functions.first_degree_equation import solve


def evaluate(expression, precise=False):

    if precise:
        getcontext().prec = constants.PRECISE_PRECISION
    else:
        getcontext().prec = constants.DEFAULT_PRECISION

    # Solve equations separately
    if "=" in expression:
        return solve(expression)

    expression = preprocess(expression)

    return eval(
        expression,
        {"__builtins__": None},
        MATH_LIB,
    )
