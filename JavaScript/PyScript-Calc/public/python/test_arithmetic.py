"""
Minimal tests for the arithmetic engine and constants.
Run with: python test_arithmetic.py
(or inside Pyodide for browser verification)
"""

from arithmetic import (
    add,
    subtract,
    multiply,
    divide,
    sqrt,
    cbrt,
    pow,
    mod,
    factorial,
)
from constants import pi_digits, e_digits, MAX_DIGITS, clear_cache


def assert_eq(actual, expected, msg=""):
    if actual != expected:
        raise AssertionError(f"{msg}: expected {expected!r}, got {actual!r}")


def test_basic():
    assert_eq(add(2, 3), 5)
    assert_eq(subtract(10, 4), 6)
    assert_eq(multiply(3, 4), 12)
    assert_eq(divide(10, 2), 5)
    assert_eq(sqrt(25), 5.0)
    assert_eq(cbrt(27), 3.0)
    assert_eq(pow(2, 8), 256)
    assert_eq(mod(10, 3), 1)
    assert_eq(factorial(5), 120)
    print("Basic arithmetic: OK")


def test_errors():
    try:
        divide(1, 0)
        raise AssertionError("Expected ZeroDivisionError")
    except ZeroDivisionError:
        pass

    try:
        sqrt(-1)
        raise AssertionError("Expected ValueError")
    except ValueError:
        pass

    try:
        factorial(-3)
        raise AssertionError("Expected ValueError")
    except ValueError:
        pass

    try:
        factorial(3.5)
        raise AssertionError("Expected ValueError")
    except ValueError:
        pass

    print("Error handling: OK")


def test_constants():
    clear_cache()
    pi10 = pi_digits(10)
    #  π ≈ 3.141592653589… → rounded to 10 places is 3.1415926536
    assert pi10.startswith("3.141592653")
    assert len(pi10.split(".")[1]) == 10

    e5 = e_digits(5)
    assert e5.startswith("2.71828")

    try:
        pi_digits(MAX_DIGITS + 1)
        raise AssertionError("Expected ValueError for >800 digits")
    except ValueError:
        pass

    # Cache hit
    pi10_again = pi_digits(10)
    assert pi10_again == pi10

    print("Constants & precision limit: OK")


if __name__ == "__main__":
    test_basic()
    test_errors()
    test_constants()
    print("All tests passed.")
