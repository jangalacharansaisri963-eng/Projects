"""
parser.py

Expression preprocessing.
"""

import re


def convert_recurring(expr):

    # Mixed recurring
    # Example: 1.2(34r)

    def mixed(match):

        whole = int(match.group(1))
        non = match.group(2)
        rep = match.group(3)

        a = len(non)
        b = len(rep)

        full = int(f"{whole}{non}{rep}")
        prefix = int(f"{whole}{non}")

        numerator = full - prefix
        denominator = (10 ** b - 1) * (10 ** a)

        numerator += whole * denominator

        return f"Fraction({numerator},{denominator})"

    expr = re.sub(
        r"(\d+)\.(\d*)\((\d+)r\)",
        mixed,
        expr,
    )

    # Pure recurring
    # Example: 1.23r

    def pure(match):

        whole = int(match.group(1))
        rep = match.group(2)

        digits = len(rep)

        full = int(f"{whole}{rep}")

        numerator = full - whole
        denominator = 10 ** digits - 1

        numerator += whole * denominator

        return f"Fraction({numerator},{denominator})"

    expr = re.sub(
        r"(\d+)\.(\d+)r",
        pure,
        expr,
    )

    return expr


def inject_implicit_mul(expr):

    expr = expr.replace("^", "**")
    
# ======================================
# Complex Numbers
# ======================================

# Allow textbook notation using i.

expr = re.sub(
    r"(\d+)i\b",
    r"\1j",
    expr,
)

expr = re.sub(
    r"(?<![A-Za-z0-9_])i\b",
    "1j",
    expr,
)

    # Allow x/X as multiplication
    expr = expr.replace("×", "*")
    expr = expr.replace("x", "*")
    expr = expr.replace("X", "*")

    expr = re.sub(r"(\d)\(", r"\1*(", expr)
    expr = re.sub(r"\)\(", r")*(", expr)

    expr = re.sub(r"(\d)pi", r"\1*pi", expr)
    expr = re.sub(r"pi\(", r"pi*(", expr)

    expr = re.sub(r"(\d)([a-zA-Z])", r"\1*\2", expr)

    return expr


def preprocess(expr):

    expr = convert_recurring(expr)
    expr = inject_implicit_mul(expr)

    return expr
