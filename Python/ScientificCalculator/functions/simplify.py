from fractions import Fraction
from math import sqrt


def cbrt(x):
    return x ** (Fraction(1, 3))


def root(x, n):
    return x ** (Fraction(1, n))


def repeating_decimal(value):
    """
    Converts repeating decimals.

    Example:
    0.(3) -> 1/3
    1.2(3) -> 37/30
    """

    if "(" not in value:
        return None

    non_repeat, repeat = value.split("(")

    repeat = repeat.replace(")", "")

    if "." in non_repeat:

        whole, decimal = non_repeat.split(".")

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
        )

    return None


def simplify(value):

    # Already Fraction
    if isinstance(value, Fraction):
        return value.limit_denominator()


    # Integer
    if isinstance(value, int):
        return value


    # Float
    if isinstance(value, float):

        f = Fraction(value).limit_denominator()

        if f.denominator == 1:
            return f.numerator

        return f


    # Complex
    if isinstance(value, complex):
        return value


    # String input
    if isinstance(value, str):

        value = value.strip()


        # Repeating decimal
        repeat = repeating_decimal(value)

        if repeat:
            return repeat


        # Expression evaluator

        scope = {
            "__builtins__": None,

            "sqrt": lambda x:
                Fraction(
                    sqrt(float(x))
                ),

            "cbrt": cbrt,

            "root": root,

            "Fraction": Fraction
        }


        try:
            result = eval(
                value,
                scope
            )

            return simplify(result)

        except Exception:
            pass


        # Plain fraction string

        try:

            f = Fraction(value)

            if f.denominator == 1:
                return f.numerator

            return f.limit_denominator()

        except Exception:

            return value


    # Other numeric values

    try:

        f = Fraction(value).limit_denominator()

        if f.denominator == 1:
            return f.numerator

        return f

    except Exception:

        return value
