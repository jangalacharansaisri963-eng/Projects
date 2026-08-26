"""check_twin(n) — whether n is part of a twin-prime pair."""

from commands.helpers import is_prime


def check_twin(n: int) -> bool:
    n = int(n)
    if not is_prime(n):
        print(f"{n} is not prime.")
        return False
    left = is_prime(n - 2)
    right = is_prime(n + 2)
    if left or right:
        parts = []
        if left:
            parts.append(f"({n - 2}, {n})")
        if right:
            parts.append(f"({n}, {n + 2})")
        print(f"{n} is part of twin pair(s): {', '.join(parts)}")
        return True
    print(f"{n} is not part of a twin prime pair.")
    return False
