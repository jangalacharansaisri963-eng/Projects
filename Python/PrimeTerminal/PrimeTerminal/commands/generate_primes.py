"""generate_primes(limit) — print all primes up to limit."""

from commands.helpers import iter_primes_upto


def generate_primes(limit: int) -> None:
    limit = int(limit)
    if limit < 2:
        print("No primes found.")
        return
    print()
    for p in iter_primes_upto(limit):
        print(p)
