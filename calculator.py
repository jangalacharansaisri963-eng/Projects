"""
calculator.py

Main application.
"""

import os
import sys
import readline
import constants

from formatter import (
    banner,
    result,
    error,
    success,
)

from commands import execute

from engine import evaluate


def run_calculator():
    # Attempt to print banner, but don't let it crash the whole program
    try:
        banner()
    except Exception:
        print("Scientific Calculator")

    while True:
        try:
            # Force prompt to show in cloud environments using sys.stdout
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
        # EXIT
        # ==========================

        if lower in ("exit", "quit"):
            break

        # ==========================
        # CLEAR
        # ==========================

        if lower in ("clear", "cls"):

            os.system("cls" if os.name == "nt" else "clear")

            banner()

            continue

        # ==========================
        # HELP
        # ==========================

        if lower == "help":

            print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print("Scientific Calculator Help")
            print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print()
            print("Trigonometry")
            print("  sin  cos  tan")
            print("  asin acos atan")
            print("  sinh cosh tanh")
            print()
            print("Roots")
            print("  sqrt  cbrt  root")
            print()
            print("Logarithms")
            print("  ln  log")
            print()
            print("Integers")
            print("  gcd")
            print("  hcf")
            print("  lcm")
            print()
            print("Factors")
            print("  factors")
            print("  factorization")
            print()
            print("Fractions")
            print("  simplify(x)")
            print("  simplify(16/100)")
            print("  simplify(0.16)")
            print("  simplify(1.23r)")
            print("  simplify(1.2(34r))")
            print()
            print("Constants")
            print("  pi")
            print("  e")
            print("  phi")
            print("  c")
            print()
            print("Modes")
            print("  mode degree")
            print("  mode radian")
            print("  <expression> precise")
            print()
            print("Commands")
            print("  help")
            print("  clear / cls")
            print("  exit / quit")
            print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

            continue

        # ==========================
        # ANGLE MODES
        # ==========================

        if lower == "mode degree":

            constants.DEGREE_MODE = True

            success("Degree mode enabled.")

            continue

        if lower == "mode radian":

            constants.DEGREE_MODE = False

            success("Radian mode enabled.")

            continue

        # ==========================
        # PRECISE MODE
        # ==========================

        precise = False

        if lower.endswith(" precise"):

            precise = True

            cmd = cmd[:-8].strip()

        # ==========================
        # SPECIAL COMMANDS
        # ==========================

        try:

            if execute(cmd):
                readline.add_history(cmd)
                continue

        except Exception as ex:

            error(ex)

            continue

        # ==========================
        # NORMAL EVALUATION
        # ==========================

        try:

            answer = evaluate(
                cmd,
                precise=precise
            )

            result(
                answer,
                precise
            )
            
            readline.add_history(cmd)

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
    
