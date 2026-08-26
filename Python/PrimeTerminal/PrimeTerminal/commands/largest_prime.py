"""largest_prime(limit) — largest prime <= limit."""

from commands.helpers import is_prime


def largest_prime(limit: int):
    limit = int(limit)
    for number in range(limit, 1, -1):
        if is_prime(number):
            print(f"Largest prime <= {limit}: {number}")
            return number
    print("No prime found.")
    return None
