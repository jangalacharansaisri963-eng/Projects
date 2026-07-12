from fractions import Fraction

def simplify(value):

    return str(Fraction(value).limit_denominator())
