from fractions import Fraction


def simplify(value):

    # Backward compatibility
    if isinstance(value, Fraction):
        return value

    # Numeric values
    if not isinstance(value, str):
        return Fraction(value).limit_denominator()

    # Remove surrounding whitespace
    value = value.strip()

    # TODO:
    # Handle sqrt(...)
    # Handle cbrt(...)
    # Handle root(...)
    # Handle repeating decimals

    return Fraction(value).limit_denominator()
