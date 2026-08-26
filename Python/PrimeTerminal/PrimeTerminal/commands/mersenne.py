"""mersenne_primes(limit) — Mersenne primes for exponents up to limit."""

from commands.helpers import is_prime


def mersenne_primes(limit: int) -> None:
    limit = int(limit)
    found = False
    for p in range(2, limit + 1):
        if is_prime(p):
            mersenne = (2 ** p) - 1
            if p <= 31 and is_prime(mersenne):
                print(mersenne)
                found = True
            elif p > 31:
                print(f"2^{p}-1 = {mersenne}  (primality not fully verified for large p)")
                found = True
    if not found:
        print("No Mersenne primes found in range.")


# alias
mersenne = mersenne_primes
