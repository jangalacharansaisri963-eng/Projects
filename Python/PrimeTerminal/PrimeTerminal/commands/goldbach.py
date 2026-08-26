"""goldbach(n) — Goldbach decomposition of even n."""

from commands.helpers import is_prime


def goldbach(n: int) -> None:
    n = int(n)
    if n <= 2 or n % 2 != 0:
        print("Goldbach only works for even numbers greater than 2.")
        return
    for first in range(2, n):
        if is_prime(first):
            second = n - first
            if is_prime(second):
                print(f"{n} = {first} + {second}")
                return
    print("No Goldbach decomposition found.")
