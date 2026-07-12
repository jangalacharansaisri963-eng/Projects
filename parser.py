"""
parser.py

Expression preprocessing.
"""

import re


def convert_recurring(expr):
    # We'll implement this next.
    return expr


def inject_implicit_mul(expr):

    expr = expr.replace("^", "**")

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
