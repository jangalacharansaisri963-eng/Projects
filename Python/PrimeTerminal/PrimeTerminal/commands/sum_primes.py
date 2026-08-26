"""sum_primes(limit) — sum of primes up to limit."""

from commands.helpers import iter_primes_upto


def sum_primes(limit: int) -> int:
    limit = int(limit)
    total = sum(iter_primes_upto(limit))
    print(f"Sum of primes up to {limit}: {total}")
    return total
