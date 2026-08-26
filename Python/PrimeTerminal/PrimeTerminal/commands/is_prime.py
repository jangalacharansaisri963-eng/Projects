"""is_prime(n) — check whether n is prime."""

from commands.helpers import is_prime as _is_prime


def is_prime(n: int) -> bool:
    result = _is_prime(int(n))
    if result:
        print(f"{n} is PRIME.")
    else:
        print(f"{n} is NOT PRIME.")
    return result
