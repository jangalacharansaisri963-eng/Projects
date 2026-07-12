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

            print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print("Commands")
            print()
            print("generate random(n)")
            print()
            print("Examples")
            print("generate random(16)")
            print("generate random(32)")
            print("generate random(128)")
            print()
            print("Rules")
            print("- Minimum length: 3")
            print("- Maximum length: 12000")
            print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

            continue

        # ==========================
        # GENERATE RANDOM
        # ==========================

        match = re.fullmatch(
            r"generate\s+random\s*\(\s*(\d+)\s*\)",
            lower,
        )

        if match:

            length = int(match.group(1))

            try:

                password = generate_password(length)

                print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
                print("Generated Password")
                print()
                print(password)
                print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

            except Exception as ex:

                print(ex)

            continue

        print("Unknown command. Type 'help'.")


if __name__ == "__main__":

    run()
