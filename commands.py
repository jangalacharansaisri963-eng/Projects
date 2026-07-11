"""
commands.py

Special calculator commands.
"""

import re

from engine import evaluate

from functions.rationals import fr


def execute(command):

    match = re.fullmatch(
        r"fr\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)\s*(\d+)",
        command,
    )

    if not match:
        return False

    left = evaluate(match.group(1))

    right = evaluate(match.group(2))

    amount = int(match.group(3))

    fr(left, right, amount)

    return True
