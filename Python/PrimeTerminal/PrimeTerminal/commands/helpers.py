"""Shared prime-number primitives used by command modules."""

from __future__ import annotations

import math
import random
from typing import List, Optional, Tuple


def is_prime(n: int) -> bool:
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    limit = int(math.sqrt(n)) + 1
    for i in range(3, limit, 2):
        if n % i == 0:
            return False
    return True


def iter_primes_upto(limit: int):
    if limit < 2:
        return
    for number in range(2, limit + 1):
        if is_prime(number):
            yield number


def next_prime_after(number: int) -> int:
    candidate = number + 1
    while True:
        if is_prime(candidate):
            return candidate
        candidate += 1


def previous_prime_before(number: int) -> Optional[int]:
    candidate = number - 1
    while candidate >= 2:
        if is_prime(candidate):
            return candidate
        candidate -= 1
    return None


def nth_prime_number(n: int) -> int:
    if n < 1:
        raise ValueError("n must be >= 1")
    count = 0
    number = 1
    while count < n:
        number += 1
        if is_prime(number):
            count += 1
    return number


def factorize(number: int) -> List[int]:
    if number < 2:
        return []
    factors: List[int] = []
    n = number
    divisor = 2
    while divisor * divisor <= n:
        while n % divisor == 0:
            factors.append(divisor)
            n //= divisor
        divisor += 1
    if n > 1:
        factors.append(n)
    return factors


def twin_pairs_upto(limit: int) -> List[Tuple[int, int]]:
    pairs: List[Tuple[int, int]] = []
    previous = None
    for number in range(2, limit + 1):
        if is_prime(number):
            if previous is not None and number - previous == 2:
                pairs.append((previous, number))
            previous = number
    return pairs


def random_prime_in_range(start: int, end: int) -> Optional[int]:
    if start > end:
        start, end = end, start
    primes = [n for n in range(start, end + 1) if is_prime(n)]
    if not primes:
        return None
    return random.choice(primes)
