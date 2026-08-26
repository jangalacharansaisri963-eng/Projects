"""find_primes(start, end) — print primes in [start, end]."""

from commands.helpers import is_prime


def find_primes(start: int, end: int) -> None:
    start, end = int(start), int(end)
    if start > end:
        start, end = end, start
    print()
    found = False
    for number in range(max(2, start), end + 1):
        if is_prime(number):
            print(number)
            found = True
    if not found:
        print("No primes found in that range.")
