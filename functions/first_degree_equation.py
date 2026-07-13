"""
first_degree_equation.py

Solves single-variable equations.

Supported:
- Exactly one variable: a
- Exactly one '='
- +  -  *  /
- Parentheses
- Decimals
- Fractions

Examples:

a + 4 = 6
2a + 5 = 17
5a - 3 = 2a + 9
a/5 = 8
5/a = 20
1/(a+2)=3
"""

from decimal import Decimal


def solve(expression):
    """
    Solve an equation in one variable 'a'.

    Returns:
        Decimal solution.
    """

    if expression.count("=") != 1:
        raise ValueError(
            "Equation must contain exactly one '='."
        )

    left, right = expression.split("=")

    def f(a):

        scope = {
            "__builtins__": None,
            "a": Decimal(str(a))
        }

        return eval(left, scope) - eval(right, scope)

    # -----------------------------
    # Search for a sign change
    # -----------------------------

    x = Decimal("-100000")
    step = Decimal("1")

    previous = f(x)

    while x <= Decimal("100000"):

        x2 = x + step

        try:
            current = f(x2)
        except Exception:
            x = x2
            previous = None
            continue

        if previous is not None:

            if current == 0:
                return x2

            if previous == 0:
                return x

            if previous * current < 0:

                low = x
                high = x2

                # Binary search

                for _ in range(120):

                    mid = (low + high) / 2

                    value = f(mid)

                    if abs(value) < Decimal("1e-40"):
                        return mid

                    if f(low) * value < 0:
                        high = mid
                    else:
                        low = mid

                return (low + high) / 2

        previous = current
        x = x2

    raise ValueError("No real solution found.")
