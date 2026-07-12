from fractions import Fraction


def simplify(value):

    if isinstance(value, Fraction):
        return value

    return Fraction(value).limit_denominator()
