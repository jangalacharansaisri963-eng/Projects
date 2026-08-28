"""
Scientific function facade — re-exports puremath (no math/sympy).
"""

from __future__ import annotations

from puremath import (
    PI, E, TAU, PHI, LN2, LN10,
    sin, cos, tan, asin, acos, atan, atan2,
    sind, cosd, tand, asind, acosd, atand,
    sec, csc, cot, secd, cscd, cotd,
    deg2rad, rad2deg, degrees, radians,
    sinh, cosh, tanh, asinh, acosh, atanh, sech, csch, coth,
    exp, expm1, log, log10, log2, log1p, ln,
    sqrt, cbrt, root, hypot, pow_,
    abs_, fabs, floor, ceil, trunc, round_, sign, copysign,
    factorial, gamma, lgamma, comb, perm,
    isqrt, gcd, lcm, isclose, fmod, remainder, frexp, ldexp, modf,
    mean, median, mode, stdev, pstdev, variance, pvariance,
    sum_, product, min_, max_,
    percent, percent_of, ratio,
    bit_and, bit_or, bit_xor, bit_not, bit_lshift, bit_rshift,
    square, cube, reciprocal, percent_change, clamp, lerp, dist, midpoint,
    to_sci, to_fixed, is_even, is_odd, is_prime, next_prime, fib,
    binomial, nCr, nPr,
    FUNCTION_TABLE, FUNCTION_CATALOG, list_scientific, build_function_table,
)

__all__ = [
    "PI", "E", "TAU", "PHI",
    "sin", "cos", "tan", "asin", "acos", "atan", "atan2",
    "sind", "cosd", "tand", "asind", "acosd", "atand",
    "sec", "csc", "cot", "secd", "cscd", "cotd",
    "deg2rad", "rad2deg", "degrees", "radians",
    "sinh", "cosh", "tanh", "asinh", "acosh", "atanh", "sech", "csch", "coth",
    "exp", "expm1", "log", "log10", "log2", "log1p", "ln",
    "sqrt", "cbrt", "root", "hypot", "pow_",
    "abs_", "fabs", "floor", "ceil", "trunc", "round_", "sign", "copysign",
    "factorial", "gamma", "lgamma", "comb", "perm",
    "isqrt", "gcd", "lcm", "isclose", "fmod", "remainder", "frexp", "ldexp", "modf",
    "mean", "median", "mode", "stdev", "pstdev", "variance", "pvariance",
    "sum_", "product", "min_", "max_",
    "percent", "percent_of", "ratio",
    "bit_and", "bit_or", "bit_xor", "bit_not", "bit_lshift", "bit_rshift",
    "square", "cube", "reciprocal", "percent_change", "clamp", "lerp", "dist", "midpoint",
    "to_sci", "to_fixed", "is_even", "is_odd", "is_prime", "next_prime", "fib",
    "binomial", "nCr", "nPr",
    "FUNCTION_TABLE", "FUNCTION_CATALOG", "list_scientific",
]
