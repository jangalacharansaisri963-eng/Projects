"""
commands.py

Special calculator commands.
"""

import random
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

    if lower in ("readmind", "mind", "telepathy"):

        print("ReadMind:")
        print("I detected... absolutely nothing.")
        print("Please type your expression.")

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
    # SCIENTIFIC CONSTANT INFO
    # ==========================================

    if lower == "c":

        print("━━━━━━━━━━━━━━━━━━━━━━")
        print("Speed of light (vacuum)")
        print()
        print("Approximately: 3 × 10⁸ m/s")
        print("Precisely: 299792458 m/s")
        print("━━━━━━━━━━━━━━━━━━━━━━")

        return True


    if lower == "phi":

        print("━━━━━━━━━━━━━━━━━━━━━━")
        print("Golden Ratio (φ)")
        print()
        print("Value:")
        print("1.6180339887498948482045868343656381177203091798057628621354486227052604628189024497072072041893911374")
        print()
        print("Used in:")
        print("- Mathematics")
        print("- Art and design")
        print("- Architecture")
        print("━━━━━━━━━━━━━━━━━━━━━━")

        return True


    # ==========================================
    # INFORMATION COMMANDS
    # ==========================================

    if lower == "functions":

        print("━━━━━━━━━━━━━━━━━━━━━━")
        print("Supported Functions")
        print()
        print("Trigonometry")
        print("sin cos tan")
        print("asin acos atan")
        print("sinh cosh tanh")
        print()
        print("Roots")
        print("sqrt cbrt root")
        print()
        print("Logarithms")
        print("ln log")
        print()
        print("Integers")
        print("gcd hcf lcm")
        print()
        print("Factors")
        print("factors factorization")
        print()
        print("Fractions")
        print("simplify")
        print("━━━━━━━━━━━━━━━━━━━━━━")

        return True


    if lower == "constants":

        print("━━━━━━━━━━━━━━━━━━━━━━")
        print("Available Constants")
        print()
        print("pi")
        print("e")
        print("phi")
        print("c")
        print("R15")
        print("━━━━━━━━━━━━━━━━━━━━━━")

        return True


    if lower == "examples":

        print("━━━━━━━━━━━━━━━━━━━━━━")
        print("Examples")
        print()
        print("sin(90)")
        print("sqrt(2)")
        print("gcd(24,18)")
        print("lcm(12,18)")
        print("simplify(16/100)")
        print("factorization(360)")
        print("━━━━━━━━━━━━━━━━━━━━━━")

        return True


    # ==========================================
    # FUN COMMANDS
    # ==========================================

    if lower == "coin":

        print(random.choice(("Heads", "Tails")))

        return True


    if lower == "dice":

        print(random.randint(1, 6))

        return True


    if lower == "whoami":

        print("You are the calculator operator.")

        return True


    if lower == "python":

        print("import this")

        return True


    if lower == "minecraft":

        print("⛏️ Creeper? Aww man...")

        return True


    if lower == "rickroll":

        print("Never gonna give you up 🎵")

        return True


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
