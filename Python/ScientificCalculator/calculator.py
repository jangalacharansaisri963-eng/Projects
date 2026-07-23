"""
calculator.py

Main application.
"""

import os
import sys

# Safe import: readline may not be available on Windows
try:
    import readline
except Exception:
    readline = None

import constants

from formatter import (
    banner,
    result,
    error,
    success,
)

from commands import execute, set_answer
from engine import evaluate


def run_calculator():

    try:
        banner()
    except Exception:
        print("Scientific Calculator")

    while True:

        try:
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

            try:
                banner()
            except Exception:
                print("Scientific Calculator")

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
                if readline:
                    readline.add_history(cmd)
                continue

        except Exception:
            error("Command failed.")
            continue

        # ==========================
        # NORMAL EVALUATION
        # ==========================

        try:

            answer = evaluate(
                cmd,
                precise=precise
            )

            set_answer(answer)

            result(
                answer,
                precise
            )

            if readline:
                readline.add_history(cmd)

        except ZeroDivisionError:
            error("Division by zero.")

        except OverflowError:
            error("Number too large.")

        except ValueError:
            error("Invalid mathematical operation.")

        except Exception:
            error("Unexpected error.")


if __name__ == "__main__":

    try:
        run_calculator()

    except Exception:
        print("\nA fatal error occurred.")
        import traceback
        traceback.print_exc()
