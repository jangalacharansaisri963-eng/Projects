"""random_prime(start, end) — random prime in range."""

from commands.helpers import random_prime_in_range


def random_prime(start: int, end: int):
    result = random_prime_in_range(int(start), int(end))
    if result is None:
        print("No primes in that range.")
    else:
        print(result)
    return result
