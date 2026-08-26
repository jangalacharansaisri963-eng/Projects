"""
Prime Terminal — Python-style function interpreter.

Examples at the prompt:

    Prime> is_prime(17)
    Prime> generate_primes(30)
    Prime> goldbach(28)
    Prime> help()
"""

from __future__ import annotations

from commands import execute_command
from version_info import VERSION

print("=" * 45)
print(f"        Prime Terminal v{VERSION}")
print("        Developed by Dan Studios")
print("=" * 45)
print("Type function calls like:  is_prime(17)")
print("Type help() for the full list.  exit() to quit.\n")

while True:
    try:
        command = input("Prime> ").strip()
        if command == "":
            continue
        execute_command(command)
    except KeyboardInterrupt:
        print("\nUse exit() to quit Prime Terminal.")
    except SystemExit:
        break
    except Exception as e:
        print(f"Error: {e}")
