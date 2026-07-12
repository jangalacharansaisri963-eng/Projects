"""
main.py

Password Generator
"""

import re

from generator import generate_password


def banner():

    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("     Password Generator")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("Type 'help' for available commands.")
    print()


def show_help():

    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("Commands")
    print()
    print("generate random(n)")
    print("generate strong(n)")
    print("generate letters(n)")
    print("generate numbers(n)")
    print("generate symbols(n)")
    print()
    print("Examples")
    print("generate strong(16)")
    print("generate letters(32)")
    print("generate numbers(8)")
    print("generate symbols(20)")
    print("generate random(128)")
    print()
    print("Password Types")
    print("- random  : All characters")
    print("- strong  : Upper + lower + number + symbol")
    print("- letters : Only letters")
    print("- numbers : Only numbers")
    print("- symbols : Only symbols")
    print()
    print("Rules")
    print("- Minimum length: 3")
    print("- Maximum length: 12000")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")


def run():

    banner()

    while True:

        try:

            command = input("$ ").strip()

        except (KeyboardInterrupt, EOFError):

            print("\nGoodbye!")

            break


        lower = command.lower()


        # ==========================
        # EXIT
        # ==========================

        if lower in ("exit", "quit"):

            print("Goodbye!")

            break


        # ==========================
        # HELP
        # ==========================

        if lower == "help":

            show_help()

            continue


        # ==========================
        # GENERATE PASSWORD
        # ==========================

        match = re.fullmatch(
            r"generate\s+(\w+)\s*\(\s*(\d+)\s*\)",
            lower,
        )


        if match:

            mode = match.group(1)
            length = int(match.group(2))


            try:

                password = generate_password(
                    length,
                    mode
                )


                print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
                print("Generated Password")
                print()
                print(password)
                print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")


            except ValueError as ex:

                print(ex)


            continue


        print("Unknown command. Type 'help'.")



if __name__ == "__main__":

    run()
