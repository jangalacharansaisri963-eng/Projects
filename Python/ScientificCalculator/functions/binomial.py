"""
binomial.py

Binomial expansions up to power 10.

Supports:

expand_plus(n)
expand_minus(n)
pascal_row(n)
"""

PASCAL = {
    0: [1],
    1: [1, 1],
    2: [1, 2, 1],
    3: [1, 3, 3, 1],
    4: [1, 4, 6, 4, 1],
    5: [1, 5, 10, 10, 5, 1],
    6: [1, 6, 15, 20, 15, 6, 1],
    7: [1, 7, 21, 35, 35, 21, 7, 1],
    8: [1, 8, 28, 56, 70, 56, 28, 8, 1],
    9: [1, 9, 36, 84, 126, 126, 84, 36, 9, 1],
    10: [1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1],
}


def pascal_row(power: int):
    """
    Returns Pascal row.

    Example:
        pascal_row(5)
    """

    if power not in PASCAL:
        raise ValueError("Supported powers: 0-10")

    return PASCAL[power]


def _power(variable: str, exponent: int):

    if exponent == 0:
        return ""

    if exponent == 1:
        return variable

    return f"{variable}^{exponent}"


def expand_plus(power: int):
    """
    Returns expansion of (a+b)^power
    """

    if power not in PASCAL:
        raise ValueError("Supported powers: 0-10")

    coeffs = PASCAL[power]

    terms = []

    for i, coeff in enumerate(coeffs):

        a_exp = power - i
        b_exp = i

        term = ""

        if coeff != 1:
            term += str(coeff)

        term += _power("a", a_exp)
        term += _power("b", b_exp)

        if term == "":
            term = "1"

        terms.append(term)

    return " + ".join(terms)


def expand_minus(power: int):
    """
    Returns expansion of (a-b)^power
    """

    if power not in PASCAL:
        raise ValueError("Supported powers: 0-10")

    coeffs = PASCAL[power]

    expression = ""

    for i, coeff in enumerate(coeffs):

        a_exp = power - i
        b_exp = i

        term = ""

        if coeff != 1:
            term += str(coeff)

        term += _power("a", a_exp)
        term += _power("b", b_exp)

        if term == "":
            term = "1"

        if i == 0:
            expression += term
        else:
            if i % 2 == 1:
                expression += " - " + term
            else:
                expression += " + " + term

    return expression


if __name__ == "__main__":

    print("(a+b)^5")
    print(expand_plus(5))
    print()

    print("(a-b)^5")
    print(expand_minus(5))
    print()

    print("Pascal Row 10")
    print(pascal_row(10))
