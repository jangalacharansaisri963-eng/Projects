"""count_primes(limit) — count primes up to limit."""

from commands.helpers import iter_primes_upto


def count_primes(limit: int) -> int:
    limit = int(limit)
    if limit < 2:
        print("Count: 0")
        return 0
    count = sum(1 for _ in iter_primes_upto(limit))
    print(f"Count: {count}")
    return count
