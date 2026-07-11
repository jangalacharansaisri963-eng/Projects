"""
calculator.py

Main application.
"""

import os

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

    banner()

    while True:

        cmd = input("calc:~$ ").strip()

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
