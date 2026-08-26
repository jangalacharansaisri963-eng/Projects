"""prime_factors(n) — prime factorization of n."""

from commands.helpers import factorize


def prime_factors(n: int):
    n = int(n)
    if n < 2:
        print("Number must be >= 2.")
        return []
    factors = factorize(n)
    print(f"Prime factors of {n}: {factors}")
    return factors
