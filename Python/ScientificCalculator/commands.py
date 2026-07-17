"""
commands.py

Special calculator commands.
"""

import random
import re
import sys
import pyperclip

from engine import evaluate
from functions.rationals import fr


# Stores latest calculator answer
latest_answer = 0



def set_answer(value):
    global latest_answer
    latest_answer = value



def execute(command):

    global latest_answer

    lower = command.lower().strip()


    # ==========================================
    # Answer Memory Commands
    # ==========================================

    if lower == "ans":

        print(latest_answer)

        return True



    if lower == "copy ans":

        pyperclip.copy(
            str(latest_answer)
        )

        print("Copied Ans to clipboard.")

        return True



    if lower == "paste":

        print(
            pyperclip.paste()
        )

        return True



    # ==========================================
    # Replace Ans inside expressions
    # ==========================================

    if "ans" in lower:

        command = re.sub(
            r"\bans\b",
            str(latest_answer),
            command,
            flags=re.IGNORECASE
        )

        result = evaluate(command)

        set_answer(result)

        print(result)

        return True



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


    # ==========================================
    # CONSTANT INFO
    # ==========================================

    if lower == "phi":

        print("━━━━━━━━━━━━━━━━━━━━━━")
        print("Golden Ratio (φ)")
        print()
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
