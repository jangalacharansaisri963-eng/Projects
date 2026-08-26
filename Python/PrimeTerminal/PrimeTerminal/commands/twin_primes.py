"""twin_primes(limit) — twin prime pairs up to limit."""

from commands.helpers import twin_pairs_upto


def twin_primes(limit: int):
    limit = int(limit)
    pairs = twin_pairs_upto(limit)
    if not pairs:
        print("No twin primes found.")
        return []
    print(f"Twin primes up to {limit}:\n")
    for a, b in pairs:
        print(f"({a}, {b})")
    return pairs
