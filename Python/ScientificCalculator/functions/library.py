"""
library.py

Builds the calculator function library.
"""

from decimal import Decimal
from fractions import Fraction

import constants
import inspect

from functions.trig import (
    sin,
    cos,
    tan,
    asin,
    acos,
    atan,
)

# Import the physics module as a whole so we can register many functions dynamically
from functions import physics as physics_mod

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

from functions.binomial import (
    expand_plus,
    expand_minus,
    pascal_row,
)

from functions.hyperbolic import (
    sinh,
    cosh,
    tanh,
)

from functions.basic_math import (
    square,
    cube,
    pow,
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
    add,
    subtract,
    multiply,
    divide,

    apsum,
    apsub,
    apterm,

    gpsum,
    gpterm,

    arithmean,
    average,

    percentage,
    percentof,
    increase,
    decrease,

    ratio,
    proportion,

    simple_interest,
    amount,
    compound_amount,
    compound_interest,

    triangular,
    nsum,
    squaresum,
    cubesum,
    oddsum,
    evensum,
    sumofintegers,

    remainder,
    quotient,

    distance,
    speed,
    time,
    work,
    power,

    kineticenergy,
    potentialenergy,

    density,
    mass,
    volume,

    pythagoras,
    hypotenuse,

    abs_value,
    min_value,
    max_value,
    clamp,
    midpoint,
    range_value,

    percent_change,

    ratio_sum,
    ratio_difference,

    direct_proportion,
    inverse_proportion,

    nth_term,

    arithmetic_mean,
    geometric_mean,
    harmonic_mean,

    factorial_ratio,
    permutation,
    combination,

    remainder_percentage,
)

from functions.roots import (
    sqrt,
    cbrt,
    root,

    sqrtrem,
    cbrtrem,

    nextsquare,
    prevsquare,

    nextcube,
    prevcube,

    isperfectsquare,
    isperfectcube,
)

from functions.logarithms import (
    ln,
    log,
)

from functions.factorial import (
    factorial,
    doublefactorial,
    superfactorial,
    hyperfactorial,
    primefactorial,
    risingfactorial,
    fallingfactorial,
)

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

    "sqrtrem": sqrtrem,
    "cbrtrem": cbrtrem,

    "nextsquare": nextsquare,
    "prevsquare": prevsquare,

    "nextcube": nextcube,
    "prevcube": prevcube,

    "isperfectsquare": isperfectsquare,
    "isperfectcube": isperfectcube,

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
    "pow": pow,
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

    "add": add,
    "subtract": subtract,
    "multiply": multiply,
    "divide": divide,

    "apsum": apsum,
    "apsub": apsub,
    "apterm": apterm,

    "gpsum": gpsum,
    "gpterm": gpterm,

    "arithmean": arithmean,
    "average": average,

    "percentage": percentage,
    "percentof": percentof,
    "increase": increase,
    "decrease": decrease,

    "ratio": ratio,
    "proportion": proportion,

    "simple_interest": simple_interest,
    "amount": amount,
    "compound_amount": compound_amount,
    "compound_interest": compound_interest,

    "triangular": triangular,
    "nsum": nsum,
    "squaresum": squaresum,
    "cubesum": cubesum,
    "oddsum": oddsum,
    "evensum": evensum,
    "sumofintegers": sumofintegers,

    "remainder": remainder,
    "quotient": quotient,

    "distance": distance,
    "speed": speed,
    "time": time,
    "work": work,
    "power": power,

    "kineticenergy": kineticenergy,
    "potentialenergy": potentialenergy,

    "density": density,
    "mass": mass,
    "volume": volume,

    "pythagoras": pythagoras,
    "hypotenuse": hypotenuse,

    "abs_value": abs_value,
    "min_value": min_value,
    "max_value": max_value,
    "clamp": clamp,
    "midpoint": midpoint,
    "range_value": range_value,

    "percent_change": percent_change,

    "ratio_sum": ratio_sum,
    "ratio_difference": ratio_difference,

    "direct_proportion": direct_proportion,
    "inverse_proportion": inverse_proportion,

    "nth_term": nth_term,

    "arithmetic_mean": arithmetic_mean,
    "geometric_mean": geometric_mean,
    "harmonic_mean": harmonic_mean,

    "factorial_ratio": factorial_ratio,
    "permutation": permutation,
    "combination": combination,

    "remainder_percentage": remainder_percentage,

    # ======================================
    # Logarithms
    # ======================================

    "ln": ln,
    "log": log,

    # ======================================
    # Factorial
    # ======================================

    "factorial": factorial,
    "doublefactorial": doublefactorial,
    "superfactorial": superfactorial,
    "hyperfactorial": hyperfactorial,
    "primefactorial": primefactorial,
    "risingfactorial": risingfactorial,
    "fallingfactorial": fallingfactorial,

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
    # Binomial Expansion
    # ======================================

    "expand_plus": expand_plus,
    "expand_minus": expand_minus,

    "pascal_row": pascal_row,

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
    "h": constants.PLANKS_CONSTANT,
    "nN": constants.AVAGADRO_NUMBER,

    # ======================================
    # Constant Helpers
    # ======================================

    "pi_digits": constants.pi_digits,
    "e_digits": constants.e_digits,
    "phi_digits": constants.phi_digits,
    "r15_digits": constants.r15_digits,

}

# -----------------------------------------------------------------------------
# Dynamically register public names from the physics module into MATH_LIB.
# Register everything that is public (no leading underscore). Prefer physics_mod.__all__
# if present; otherwise register all non-underscore attributes. This will include
# callables (functions/classes) and constants (numbers) added in physics.py.
# -----------------------------------------------------------------------------
public_names = getattr(physics_mod, "__all__", None)
if public_names is None:
    public_names = [n for n in dir(physics_mod) if not n.startswith("_")]

for _name in public_names:
    if _name in MATH_LIB:
        # don't override existing explicit entries
        continue
    try:
        _obj = getattr(physics_mod, _name)
    except AttributeError:
        continue
    MATH_LIB[_name] = _obj

# Also expose the physics module under a key for convenience
if "physics" not in MATH_LIB:
    MATH_LIB["physics"] = physics_mod
