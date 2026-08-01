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


def add(a, b):
    return a + b


def subtract(a, b):
    return a - b


def multiply(a, b):
    return a * b


def divide(a, b):
    if b == 0:
        raise ZeroDivisionError(
            "Cannot divide by zero."
        )

    return a / b


def apsum(a, b):
    return (a + b) * b / 2


def apsub(a, b):
    return (a - b) * b / 2


def apterm(a, d, n):
    return a + (n - 1) * d


def gpsum(a, r, n):
    if r == 1:
        return a * n

    return a * (r ** n - 1) / (r - 1)


def gpterm(a, r, n):
    return a * r ** (n - 1)


def arithmean(a, b):
    return (a + b) / 2


def average(a, b):
    return (a + b) / 2


def percentage(value, percent):
    return value * percent / 100


def percentof(a, b):
    return (a / b) * 100


def increase(value, percent):
    return value * (1 + percent / 100)


def decrease(value, percent):
    return value * (1 - percent / 100)


def ratio(a, b):
    return a / b


def proportion(a, b, c):
    return (b * c) / a


def simple_interest(p, r, t):
    return (p * r * t) / 100


def amount(p, r, t):
    return p + simple_interest(p, r, t)


def compound_amount(p, r, n, t):
    return p * (1 + r / (100 * n)) ** (n * t)


def compound_interest(p, r, n, t):
    return compound_amount(p, r, n, t) - p


def factorial(n):
    result = 1

    for i in range(1, n + 1):
        result *= i

    return result


def triangular(n):
    return n * (n + 1) / 2


def nsum(n):
    return n * (n + 1) / 2


def squaresum(n):
    return n * (n + 1) * (2 * n + 1) / 6


def cubesum(n):
    return (n * (n + 1) / 2) ** 2


def oddsum(n):
    return n ** 2


def evensum(n):
    return n * (n + 1)


def sumofintegers(a, b):
    return (a + b) * (b - a + 1) / 2


def remainder(a, b):
    return a % b


def quotient(a, b):
    if b == 0:
        raise ZeroDivisionError(
            "Cannot divide by zero."
        )

    return a // b


def distance(speed, time):
    return speed * time


def speed(distance, time):
    return distance / time


def time(distance, speed):
    return distance / speed


def work(force, distance):
    return force * distance


def power(work, time):
    return work / time


def kineticenergy(mass, velocity):
    return 0.5 * mass * velocity ** 2


def potentialenergy(mass, gravity, height):
    return mass * gravity * height


def density(mass, volume):
    return mass / volume


def mass(density, volume):
    return density * volume


def volume(mass, density):
    return mass / density


def pythagoras(a, b):
    return (a ** 2 + b ** 2) ** 0.5


def hypotenuse(a, b):
    return (a ** 2 + b ** 2) ** 0.5


def quadratic(a, b, c):
    discriminant = b ** 2 - 4 * a * c

    if discriminant < 0:
        return None

    return (
        (-b + discriminant ** 0.5) / (2 * a),
        (-b - discriminant ** 0.5) / (2 * a)
        )
