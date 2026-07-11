"""
commands.py

Special calculator commands.
"""

import re
import sys

from engine import evaluate
from functions.rationals import fr


def execute(command):

    lower = command.lower().strip()

    # ==========================================
    # Easter Eggs
    # ==========================================

    if lower == "about":

        print("━━━━━━━━━━━━━━━━━━━━━━")
        print("Scientific Calculator")
        print("Version 1.0")
        print("Made with Python")
        print("━━━━━━━━━━━━━━━━━━━━━━")

        return True


    if lower == "version":

        print("Scientific Calculator v1.0")

        return True


    if lower == "coffee":

        print("☕ Coffee not included.")

        return True


    if lower == "sudo":

        print("Permission denied. Nice try.")

        return True


    if lower == "hello":

        print("Hello! 👋")

        return True


    if lower == "42":

        print("The answer to life, the universe, and everything.")

        return True


    if lower == "god":

        print("♾️")

        return True


    if lower == "boom":

        print("💥 Boom!")

        sys.exit(0)


    # ==========================================
    # fr(a,b) n
    # ==========================================

    match = re.fullmatch(
        r"fr\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)\s*(\d+)",
        command,
    )

    if match:

        left = evaluate(match.group(1))

        right = evaluate(match.group(2))

        amount = int(match.group(3))

        fr(left, right, amount)

        return True


    return False
