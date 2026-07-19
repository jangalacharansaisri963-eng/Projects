"""
calculator.py

Main application.
"""

import os
import sys
import traceback
from datetime import datetime

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
from functions.help_command import show_help


LOG_FILE = "latestlog.txt"


def write_log(message):
    with open(LOG_FILE, "a", encoding="utf-8") as log:
        log.write(message + "\n")


def run_calculator():

    # Create fresh log every launch
    with open(LOG_FILE, "w", encoding="utf-8") as log:
        log.write("=== Scientific Calculator ===\n")
        log.write(f"Started: {datetime.now()}\n\n")

    # Attempt to print banner
    try:
        banner()
    except Exception:
        print("Scientific Calculator")
        write_log("Banner failed to load.")

    while True:

        try:
            sys.stdout.write("$ ")
            sys.stdout.flush()
            cmd = sys.stdin.readline().strip()

        except (KeyboardInterrupt, EOFError):
            print("\nGoodbye!")
            write_log("Program exited normally.")
            break

        except Exception:
            write_log("INPUT ERROR")
            write_log(traceback.format_exc())
            raise

        if not cmd:
            continue

        lower = cmd.lower()

        # ==========================
        # EXIT
        # ==========================

        if lower in ("exit", "quit"):
            write_log("User exited.")
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
        # HELP
        # ==========================

        if lower == "help":
            show_help()
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
            write_log("COMMAND ERROR")
            write_log(traceback.format_exc())
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
            write_log("Division by zero.")

        except OverflowError:
            error("Number too large.")
            write_log("Overflow.")

        except ValueError:
            error("Invalid mathematical operation.")
            write_log("ValueError.")

        except Exception:
            error("Unexpected error.")
            write_log("EVALUATION ERROR")
            write_log(traceback.format_exc())


if __name__ == "__main__":

    try:
        run_calculator()

    except Exception:

        with open(LOG_FILE, "a", encoding="utf-8") as log:

            log.write("\n=== FATAL CRASH ===\n")
            traceback.print_exc(file=log)

        print("\nA fatal error occurred.")
        print("See latestlog.txt for details.")
