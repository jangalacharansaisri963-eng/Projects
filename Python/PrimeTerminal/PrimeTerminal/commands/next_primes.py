"""next_prime(n) — next prime after n."""

from commands.helpers import next_prime_after


def next_prime(n: int) -> int:
    result = next_prime_after(int(n))
    print(result)
    return result
