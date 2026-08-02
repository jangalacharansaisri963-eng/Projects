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

from functions import basic_math as basic_math_mod

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


# Register the basic math helpers from the module directly so the calculator
# can import and evaluate them without relying on a fragile alias list.

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

    "square": basic_math_mod.square,
    "cube": basic_math_mod.cube,
    "pow": basic_math_mod.pow,
    "reciprocal": basic_math_mod.reciprocal,
    "lerp": basic_math_mod.lerp,

    "is_even": basic_math_mod.is_even,
    "is_odd": basic_math_mod.is_odd,

    "is_prime": basic_math_mod.is_prime,
    "next_prime": basic_math_mod.next_prime,
    "previous_prime": basic_math_mod.previous_prime,

    "prime_factors": basic_math_mod.prime_factors,
    "factor_count": basic_math_mod.factor_count,

    "digit_sum": basic_math_mod.digit_sum,
    "digit_product": basic_math_mod.digit_product,

    "reverse_number": basic_math_mod.reverse_number,

    "add": basic_math_mod.add,
    "subtract": basic_math_mod.subtract,
    "multiply": basic_math_mod.multiply,
    "divide": basic_math_mod.divide,

    "apsum": basic_math_mod.apsum,
    "apsub": basic_math_mod.apsub,
    "apterm": basic_math_mod.apterm,

    "gpsum": basic_math_mod.gpsum,
    "gpterm": basic_math_mod.gpterm,

    "arithmean": basic_math_mod.arithmean,
    "average": basic_math_mod.average,

    "percentage": basic_math_mod.percentage,
    "percentof": basic_math_mod.percentof,
    "increase": basic_math_mod.increase,
    "decrease": basic_math_mod.decrease,

    "ratio": basic_math_mod.ratio,
    "proportion": basic_math_mod.proportion,

    "simple_interest": basic_math_mod.simple_interest,
    "amount": basic_math_mod.amount,
    "compound_amount": basic_math_mod.compound_amount,
    "compound_interest": basic_math_mod.compound_interest,

    "triangular": basic_math_mod.triangular,
    "nsum": basic_math_mod.nsum,
    "squaresum": basic_math_mod.squaresum,
    "cubesum": basic_math_mod.cubesum,
    "oddsum": basic_math_mod.oddsum,
    "evensum": basic_math_mod.evensum,
    "sumofintegers": basic_math_mod.sumofintegers,

    "remainder": basic_math_mod.remainder,
    "quotient": basic_math_mod.quotient,

    "pythagoras": basic_math_mod.pythagoras,
    "hypotenuse": basic_math_mod.hypotenuse,

    "abs_value": basic_math_mod.abs_value,
    "min_value": basic_math_mod.min_value,
    "max_value": basic_math_mod.max_value,
    "clamp": basic_math_mod.clamp,
    "midpoint": basic_math_mod.midpoint,
    "range_value": basic_math_mod.range_value,

    "percent_change": basic_math_mod.percent_change,

    "ratio_sum": basic_math_mod.ratio_sum,
    "ratio_difference": basic_math_mod.ratio_difference,

    "direct_proportion": basic_math_mod.direct_proportion,
    "inverse_proportion": basic_math_mod.inverse_proportion,

    "nth_term": basic_math_mod.nth_term,

    "arithmetic_mean": basic_math_mod.arithmetic_mean,
    "geometric_mean": basic_math_mod.geometric_mean,
    "harmonic_mean": basic_math_mod.harmonic_mean,

    "factorial_ratio": basic_math_mod.factorial_ratio,
    "permutation": basic_math_mod.permutation,
    "combination": basic_math_mod.combination,

    "remainder_percentage": basic_math_mod.remainder_percentage,

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
