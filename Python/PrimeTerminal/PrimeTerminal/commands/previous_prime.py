"""previous_prime(n) — previous prime before n."""

from commands.helpers import previous_prime_before


def previous_prime(n: int):
    result = previous_prime_before(int(n))
    if result is None:
        print("No previous prime.")
    else:
        print(result)
    return result
