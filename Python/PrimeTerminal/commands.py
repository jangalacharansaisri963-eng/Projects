import os
import sys

from prime import (
    generate_primes,
    find_primes,
    is_prime
)


VERSION = "1.0.0"


def execute_command(command):
    args = command.split()

    if len(args) == 0:
        return

    # help
    if args[0] == "help":
        print("""
================= Prime Terminal =================

General
--------
help
about
version
clear
exit

Prime Commands
--------------
generate primes <n>
find primes <start> <end>
is prime <number>

===============================================
""")

    # about
    elif args[0] == "about":
        print("""
Prime Terminal
Created by Dan Studios

Developer Authority Nature
""")

    # version
    elif args[0] == "version":
        print("Prime Terminal v" + VERSION)

    # clear
    elif args[0] == "clear":
        os.system("cls" if os.name == "nt" else "clear")

    # exit
    elif args[0] == "exit":
        print("Goodbye!")
        sys.exit()

    # generate primes
    elif len(args) == 3 and args[0] == "generate" and args[1] == "primes":
        generate_primes(int(args[2]))

    # find primes
    elif len(args) == 4 and args[0] == "find" and args[1] == "primes":
        find_primes(int(args[2]), int(args[3]))

    # is prime
    elif len(args) == 3 and args[0] == "is" and args[1] == "prime":
        number = int(args[2])

        if is_prime(number):
            print(f"{number} is PRIME.")
        else:
            print(f"{number} is NOT prime.")

    else:
        print("Unknown command. Type 'help'.")
