"""
basic_math.py

Basic mathematical utility functions.
"""

from math import isqrt


def square(x):
    return x * x


def cube(x):
    return x * x * x


def reciprocal(x):
    if x == 0:
        raise ZeroDivisionError(
            "Cannot take the reciprocal of zero."
        )

    return 1 / x


def lerp(a, b, t):
    """
    Linear interpolation.

    t = 0 -> a
    t = 1 -> b
    """

    return a + (b - a) * t


def is_even(n):
    return int(n) % 2 == 0


def is_odd(n):
    return int(n) % 2 == 1


def is_prime(n):

    n = int(n)

    if n < 2:
        return False

    if n == 2:
        return True

    if n % 2 == 0:
        return False

    limit = isqrt(n)

    for i in range(3, limit + 1, 2):
        if n % i == 0:
            return False

    return True


def next_prime(n):

    n = int(n) + 1

    while not is_prime(n):
        n += 1

    return n


def previous_prime(n):

    n = int(n) - 1

    while n >= 2:

        if is_prime(n):
            return n

        n -= 1

    raise ValueError(
        "No previous prime exists."
    )


def prime_factors(n):

    n = int(n)

    if n < 2:
        return []

    factors = []

    while n % 2 == 0:
        factors.append(2)
        n //= 2

    divisor = 3

    while divisor * divisor <= n:

        while n % divisor == 0:
            factors.append(divisor)
            n //= divisor

        divisor += 2

    if n > 1:
        factors.append(n)

    return factors


def factor_count(n):

    n = abs(int(n))

    if n == 0:
        raise ValueError(
            "Zero has infinitely many factors."
        )

    count = 0

    limit = isqrt(n)

    for i in range(1, limit + 1):

        if n % i == 0:

            if i == n // i:
                count += 1
            else:
                count += 2

    return count


def digit_sum(n):

    digits = str(abs(int(n)))

    return sum(
        int(digit)
        for digit in digits
    )


def digit_product(n):

    digits = str(abs(int(n)))

    product = 1

    for digit in digits:
        product *= int(digit)

    return product


def reverse_number(n):

    negative = int(n) < 0

    reversed_number = int(
        str(abs(int(n)))[::-1]
    )

    if negative:
        reversed_number *= -1

    return reversed_number
