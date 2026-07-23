"""
factorial.py

Factorial functions.
"""

import math


def factorial(x):

    if int(x) != x:
        raise ValueError(
            "Factorial is only defined for integers."
        )

    return math.factorial(int(x))


def doublefactorial(x):
    """
    n!!

    Example:
    8!! = 8×6×4×2
    """

    n = int(x)

    if n < 0:
        raise ValueError("Negative numbers not allowed.")

    if n == 0 or n == 1:
        return 1

    result = 1

    while n > 1:
        result *= n
        n -= 2

    return result


def superfactorial(x):
    """
    sf(n)=1!×2!×...×n!
    """

    n = int(x)

    result = 1

    for i in range(1, n + 1):
        result *= math.factorial(i)

    return result


def hyperfactorial(x):
    """
    H(n)=1^1×2^2×...×n^n
    """

    n = int(x)

    result = 1

    for i in range(1, n + 1):
        result *= i ** i

    return result


def primefactorial(x):
    """
    Product of all primes ≤ n
    """

    n = int(x)

    result = 1

    for i in range(2, n + 1):

        prime = True

        for j in range(2, int(i ** 0.5) + 1):

            if i % j == 0:
                prime = False
                break

        if prime:
            result *= i

    return result


def risingfactorial(x, k):
    """
    (x)^k = x(x+1)...(x+k-1)
    """

    x = int(x)
    k = int(k)

    result = 1

    for i in range(k):
        result *= x + i

    return result


def fallingfactorial(x, k):
    """
    x_(k)=x(x-1)...(x-k+1)
    """

    x = int(x)
    k = int(k)

    result = 1

    for i in range(k):
        result *= x - i

    return result
