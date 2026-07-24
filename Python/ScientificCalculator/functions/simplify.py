"""
simplify.py

Simplifies numeric values and expressions.
"""

from fractions import Fraction

from functions.library import MATH_LIB


def repeating_decimal(value):
    """
    Converts repeating decimals.

    Examples:
    0.(3) -> 1/3
    1.2(3) -> 37/30
    """

    if "(" not in value:
        return None

    before, repeat = value.split("(")
    repeat = repeat.replace(")", "")

    if "." not in before:
        return None

    whole, decimal = before.split(".")

    numerator = (
        int(whole + decimal + repeat)
        -
        int(whole + decimal)
    )

    denominator = (
        (10 ** len(decimal))
        *
        (10 ** len(repeat) - 1)
    )

    return Fraction(
        numerator,
        denominator
    ).limit_denominator()


def simplify(value):
    """
    Simplify numbers and evaluate expressions.

    Examples:

    simplify("1/2+2/5")
    -> 9/10

    simplify("sqrt(25)")
    -> 5

    simplify("factorial(5)")
    -> 120

    simplify("0.(3)")
    -> 1/3
    """

    # Fraction
    if isinstance(value, Fraction):
        return value.limit_denominator()

    # Integer
    if isinstance(value, int):
        return value

    # Float
    if isinstance(value, float):

        fraction = Fraction(
            value
        ).limit_denominator()

        if fraction.denominator == 1:
            return fraction.numerator

        return fraction

    # Complex
    if isinstance(value, complex):
        return value

    # Other numeric values
    if not isinstance(value, str):

        try:

            fraction = Fraction(
                value
            ).limit_denominator()

            if fraction.denominator == 1:
                return fraction.numerator

            return fraction

        except Exception:

            return value

    # String input
    value = value.strip()

    # Repeating decimals
    repeat = repeating_decimal(value)

    if repeat is not None:
        return repeat

    # Evaluate expressions
    scope = {
        "__builtins__": None,
    }

    scope.update(MATH_LIB)

    try:

        result = eval(
            value,
            scope
        )

        if result == value:
            return result

        return simplify(result)

    except Exception:
        pass

    # Plain fraction string
    try:

        fraction = Fraction(
            value
        ).limit_denominator()

        if fraction.denominator == 1:
            return fraction.numerator

        return fraction

    except Exception:

        return value
