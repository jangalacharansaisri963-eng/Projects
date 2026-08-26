"""emirp_primes(limit) — emirp primes up to limit."""

from commands.helpers import is_prime


def emirp_primes(limit: int) -> None:
    limit = int(limit)
    found = False
    for number in range(13, limit + 1):
        if is_prime(number):
            reverse = int(str(number)[::-1])
            if reverse != number and is_prime(reverse):
                print(number)
                found = True
    if not found:
        print("No emirp primes found.")


emirp = emirp_primes
