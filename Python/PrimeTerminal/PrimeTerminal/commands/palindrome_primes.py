"""palindrome_primes(limit) — palindromic primes up to limit."""

from commands.helpers import is_prime


def palindrome_primes(limit: int) -> None:
    limit = int(limit)
    found = False
    for number in range(2, limit + 1):
        if is_prime(number) and str(number) == str(number)[::-1]:
            print(number)
            found = True
    if not found:
        print("No palindromic primes found.")
