"""
calculator.py

Main application.
"""

import os
import sys
import constants
from formatter import (banner, result, error, success)
from commands import execute
from engine import evaluate

# Safe import for readline to prevent environment freezes
try:
    import readline
except ImportError:
    readline = None

def run_calculator():
    # Attempt to print banner, but fall back to text if encoding fails
    try:
        banner()
    except Exception:
        print("--- Scientific Calculator ---")

    while True:
        try:
            # Force prompt to show immediately in any environment
            sys.stdout.write("$ ")
            sys.stdout.flush()
            cmd = sys.stdin.readline().strip()
        except (KeyboardInterrupt, EOFError):
            print("\nGoodbye!")
            break

        if not cmd:
            continue

        lower = cmd.lower()

        # ==========================
        # COMMANDS
        # ==========================

        if lower in ("exit", "quit"):
            print("Goodbye!")
            break

        if lower in ("clear", "cls"):
            os.system("cls" if os.name == "nt" else "clear")
            banner()
            continue

        if lower == "help":
            print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print("Scientific Calculator Help")
            print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print("\nTrigonometry: sin, cos, tan, asin, acos, atan, sinh, cosh, tanh")
            print("Roots: sqrt, cbrt, root | Logarithms: ln, log")
            print("Integers: gcd, hcf, lcm | Factors: factors, factorization")
            print("Fractions: simplify(x) | Constants: pi, e, phi, c")
            print("Commands: help, clear, exit, mode degree/radian, <expr> precise")
            print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            continue

        if lower == "mode degree":
            constants.DEGREE_MODE = True
            success("Degree mode enabled.")
            continue

        if lower == "mode radian":
            constants.DEGREE_MODE = False
            success("Radian mode enabled.")
            continue

        # ==========================
        # EVALUATION
        # ==========================

        precise = False
        if lower.endswith(" precise"):
            precise = True
            cmd = cmd[:-8].strip()

        # Try special engine commands
        try:
            if execute(cmd):
                if readline: readline.add_history(cmd)
                continue
        except Exception as ex:
            error(ex)
            continue

        # Normal math
        try:
            answer = evaluate(cmd, precise=precise)
            result(answer, precise)
            if readline: readline.add_history(cmd)
        except ZeroDivisionError:
            error("Division by zero.")
        except OverflowError:
            error("Number too large.")
        except ValueError:
            error("Invalid mathematical operation.")
        except Exception as ex:
            error(ex)

if __name__ == "__main__":
    run_calculator()
    
