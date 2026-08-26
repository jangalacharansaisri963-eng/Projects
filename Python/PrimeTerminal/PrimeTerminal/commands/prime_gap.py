"""prime_gap(n) — gap between previous and next prime around n."""

from commands.helpers import previous_prime_before, next_prime_after


def prime_gap(n: int):
    n = int(n)
    previous = previous_prime_before(n)
    nxt = next_prime_after(n)
    if previous is None:
        print("No previous prime.")
        return None
    gap = nxt - previous
    print(f"Around {n}: previous={previous}, next={nxt}, gap={gap}")
    return gap
