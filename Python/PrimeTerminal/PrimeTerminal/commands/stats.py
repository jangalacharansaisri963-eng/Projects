"""stats(limit) — statistics about primes up to limit."""

from commands.helpers import iter_primes_upto


def stats(limit: int) -> None:
    limit = int(limit)
    primes = list(iter_primes_upto(limit))
    if not primes:
        print("No primes found.")
        return
    total = sum(primes)
    print("\n========== Prime Statistics ==========")
    print(f"Limit           : {limit}")
    print(f"Total Primes    : {len(primes)}")
    print(f"Smallest Prime  : {primes[0]}")
    print(f"Largest Prime   : {primes[-1]}")
    print(f"Sum of Primes   : {total}")
    print(f"Average Prime   : {total / len(primes):.2f}")
    if len(primes) > 1:
        gaps = [primes[i] - primes[i - 1] for i in range(1, len(primes))]
        print(f"Smallest Gap    : {min(gaps)}")
        print(f"Largest Gap     : {max(gaps)}")
        print(f"Average Gap     : {sum(gaps) / len(gaps):.2f}")
    print("======================================")
