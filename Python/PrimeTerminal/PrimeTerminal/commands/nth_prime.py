"""nth_prime(n) — the nth prime number."""

from commands.helpers import nth_prime_number


def nth_prime(n: int) -> int:
    n = int(n)
    if n < 1:
        print("n must be at least 1.")
        return None
    result = nth_prime_number(n)
    print(f"The {n}th prime is {result}.")
    return result
