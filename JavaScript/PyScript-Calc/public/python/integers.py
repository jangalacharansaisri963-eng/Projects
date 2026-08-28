"""
Integer / decimal GCD and LCM.

Accepts int, float, and Decimal (including mixes). Non-integer decimals are
scaled to integers, the classic Euclidean algorithm is applied, then the
result is scaled back. No use of the math module.
"""

from __future__ import annotations

from decimal import Decimal, InvalidOperation
from typing import List, Tuple, Union

Number = Union[int, float, Decimal]


def _collect(args: tuple) -> List[Number]:
    numbers: List[Number] = []
    for arg in args:
        if isinstance(arg, (list, tuple)):
            numbers.extend(arg)
        else:
            numbers.append(arg)
    if not numbers:
        raise ValueError("At least one number must be provided")
    return numbers

def _to_decimal(n: Number) -> Decimal:
    if isinstance(n, Decimal):
        d = n
    elif isinstance(n, bool):
        # bool is a subclass of int — reject explicitly
        raise ValueError("Boolean values are not allowed")
    elif isinstance(n, int):
        d = Decimal(n)
    elif isinstance(n, float):
        # str() avoids binary float artifacts (e.g. 0.1)
        d = Decimal(str(n))
    else:
        try:
            d = Decimal(str(n))
        except (InvalidOperation, ValueError, TypeError) as exc:
            raise ValueError(f"Invalid number: {n!r}") from exc

    if not d.is_finite():
        raise ValueError("Only finite numbers are allowed")
    return d

def _scale_to_ints(numbers: List[Number]) -> Tuple[List[int], Decimal]:
    """
    Convert all values to Decimal, multiply by 10**k so every value is an
    integer, return (scaled_ints, scale_factor).
    """
    decs = [_to_decimal(n) for n in numbers]

    places = 0
    for d in decs:
        exp = d.as_tuple().exponent
        if isinstance(exp, int) and exp < 0:
            places = max(places, -exp)

    scale = Decimal(10) ** places
    ints = [int(d * scale) for d in decs]
    return ints, scale


def _unscale(value: int, scale: Decimal) -> Union[int, Decimal]:
    if scale == 1:
        return value
    return Decimal(value) / scale


def gcd(*args: Number) -> Union[int, Decimal]:
    """
    Greatest Common Divisor.

    Accepts ints, floats, and Decimals (mixed OK). Decimals are scaled
    to integers first, so gcd(1.2, 0.8) → 0.4.
    """
    if not args:
        raise ValueError("At least one number must be provided")

    numbers = _collect(args)
    ints, scale = _scale_to_ints(numbers)

    result = abs(ints[0])
    for n in ints[1:]:
        b = abs(n)
        while b:
            result, b = b, result % b
        if result == 1:
            break

    return _unscale(result, scale)

def lcm(*args: Number) -> Union[int, Decimal]:
    """
    Least Common Multiple (always non-negative).

    Accepts ints, floats, and Decimals (mixed OK). Decimals are scaled
    to integers first, so lcm(1.2, 0.8) → 2.4.
    """
    if not args:
        raise ValueError("At least one number must be provided")

    numbers = _collect(args)
    ints, scale = _scale_to_ints(numbers)

    result = abs(ints[0])
    for n in ints[1:]:
        b = abs(n)
        if result == 0 or b == 0:
            result = 0
            break
        # lcm(a, b) = |a * b| / gcd(a, b)  — inline Euclidean
        product = abs(result * b)
        x, y = result, b
        while y:
            x, y = y, x % y
        result = product // x

    return _unscale(result, scale)

def least_number_to_add(target: Number, *args: Number) -> Union[int, Decimal]:
    """
    Find the least non-negative value that must be added to 'target'
    so that the result is divisible by all numbers in args (i.e., multiple of their LCM).
    """
    lcm_val = lcm(*args)
    if lcm_val == 0:
        raise ValueError("LCM of divisors cannot be zero")
    
    # Convert everything to Decimal to maintain precise arithmetic with floats/decimals
    t_dec = _to_decimal(target)
    lcm_dec = _to_decimal(lcm_val)
    
    remainder = t_dec % lcm_dec
    if remainder == 0:
        return _to_decimal(0)
    
    return lcm_dec - remainder


def least_number_to_subtract(target: Number, *args: Number) -> Union[int, Decimal]:
    """
    Find the least non-negative value that must be subtracted from 'target'
    so that the result is divisible by all numbers in args.
    """
    lcm_val = lcm(*args)
    if lcm_val == 0:
        raise ValueError("LCM of divisors cannot be zero")
    
    t_dec = _to_decimal(target)
    lcm_dec = _to_decimal(lcm_val)
    
    remainder = t_dec % lcm_dec
    return remainder


def greatest_n_digit_number(digits: int, *args: Number) -> int:
    """
    Find the greatest number of 'digits' length that is divisible by all numbers in args.
    Example: greatest_n_digit_number(4, 15, 25, 40, 75) -> 9600
    """
    if not isinstance(digits, int) or digits <= 0:
        raise ValueError("Digits must be a positive integer")
    
    lcm_val = int(lcm(*args))
    if lcm_val == 0:
        raise ValueError("LCM of divisors cannot be zero")
    
    max_n_digit = (10 ** digits) - 1
    remainder = max_n_digit % lcm_val
    return max_n_digit - remainder

def least_n_digit_number(digits: int, *args: Number) -> int:
    """
    Find the least number of 'digits' length that is divisible by all numbers in args.
    """
    if not isinstance(digits, int) or digits <= 0:
        raise ValueError("Digits must be a positive integer")
    
    lcm_val = int(lcm(*args))
    if lcm_val == 0:
        raise ValueError("LCM of divisors cannot be zero")
    
    min_n_digit = 10 ** (digits - 1)
    remainder = min_n_digit % lcm_val
    if remainder == 0:
        return min_n_digit
    return min_n_digit + (lcm_val - remainder)

def gcd_fraction(*args: Number | str) -> Union[int, Decimal]:
    """
    Greatest Common Divisor for fractions.
    Formula: GCD(a/b, c/d, ...) = GCD(a, c, ...) / LCM(b, d, ...)
    Accepts floats, ints, Decimals, or fraction strings like "3/4".
    """
    if not args:
        raise ValueError("At least one fraction must be provided")

    numerators = []
    denominators = []

    for arg in args:
        # Handle string fractions like "3/4" or standard numbers
        str_arg = str(arg).strip()
        if "/" in str_arg:
            parts = str_arg.split("/")
            if len(parts) != 2:
                raise ValueError(f"Invalid fraction format: {arg}")
            num = _to_decimal(parts[0].strip())
            den = _to_decimal(parts[1].strip())
        else:
            num = _to_decimal(arg)
            den = Decimal(1)

        if den == 0:
            raise ZeroDivisionError("Fraction denominator cannot be zero")
        
        # Normalize to avoid negative denominators
        if den < 0:
            num = -num
            den = -den

        numerators.append(num)
        denominators.append(den)

    # GCD of fractions = GCD of all numerators / LCM of all denominators
    top_gcd = gcd(*numerators)
    bottom_lcm = lcm(*denominators)

    if bottom_lcm == 0:
        raise ZeroDivisionError("Denominator LCM resulted in zero")

    return _to_decimal(top_gcd) / _to_decimal(bottom_lcm)

def lcm_fraction(*args: Number | str) -> Union[int, Decimal]:
    """
    Least Common Multiple for fractions.
    Formula: LCM(a/b, c/d, ...) = LCM(a, c, ...) / GCD(b, d, ...)
    Accepts floats, ints, Decimals, or fraction strings like "2/3".
    """
    if not args:
        raise ValueError("At least one fraction must be provided")

    numerators = []
    denominators = []

    for arg in args:
        str_arg = str(arg).strip()
        if "/" in str_arg:
            parts = str_arg.split("/")
            if len(parts) != 2:
                raise ValueError(f"Invalid fraction format: {arg}")
            num = _to_decimal(parts[0].strip())
            den = _to_decimal(parts[1].strip())
        else:
            num = _to_decimal(arg)
            den = Decimal(1)

        if den == 0:
            raise ZeroDivisionError("Fraction denominator cannot be zero")

        if den < 0:
            num = -num
            den = -den

        numerators.append(num)
        denominators.append(den)

    # LCM of fractions = LCM of all numerators / GCD of all denominators
    top_lcm = lcm(*numerators)
    bottom_gcd = gcd(*denominators)

    if bottom_gcd == 0:
        raise ZeroDivisionError("Denominator GCD resulted in zero")

    return _to_decimal(top_lcm) / _to_decimal(bottom_gcd)

def greatest_number_dividing_leaving_same_remainder(*args: Number) -> int:
    """
    Find the greatest number that will divide all numbers in args 
    leaving the same remainder in each case.
    Logic: GCD of the absolute differences between each pair of numbers 
    (or successive differences when sorted).
    Example: 1356, 1868, 2764 -> GCD of (1868-1356), (2764-1868), etc.
    """
    numbers = [abs(int(_to_decimal(n))) for n in _collect(args)]
    if len(numbers) < 2:
        raise ValueError("At least two numbers are required for this operation")
    
    # Sort numbers to easily subtract adjacent elements or find differences
    numbers.sort()
    
    # Calculate differences between adjacent numbers
    differences = [numbers[i+1] - numbers[i] for i in range(len(numbers) - 1)]
    
    # Return the GCD of all these differences
    return gcd(*differences)


def least_number_leaving_remainders(remainders: list[Number], divisors: list[Number]) -> Union[int, Decimal]:
    """
    Find the least possible number which when divided by each divisor in 'divisors' 
    leaves the corresponding remainder in 'remainders'.
    Example: When divided by 13 leaves 3, and by 5 leaves 2.
    """
    if len(divisors) != len(remainders):
        raise ValueError("Divisors and remainders lists must have the same length")
    
    # For a system of two equations (can be generalized):
    # N = L * k + remainder
    lcm_val = int(lcm(*divisors))
    
    # Check using brute force search over the LCM period or Chinese Remainder approach
    # For standard olympiad problems, checking modular matches up to LCM works cleanly:
    for val in range(0, lcm_val * max(int(lcm(*divisors)), 1) + 1):
        match = True
        for rem, div in zip(remainders, divisors):
            if val % int(div) != int(rem):
                match = False
                break
        if match:
            return val
            
    # Fallback generic search step
    raise ValueError("No common solution found within range")


def least_number_leaving_same_remainder(remainder: Number, *args: Number) -> Union[int, Decimal]:
    """
    Find the least possible number which when divided by each number in args 
    leaves the *same* given remainder in each case.
    Logic: LCM(args) + remainder
    """
    lcm_val = lcm(*args)
    rem_dec = _to_decimal(remainder)
    return _to_decimal(lcm_val) + rem_dec


def least_number_leaving_respective_differences(divisors: list[Number], target_remainders: list[Number]) -> Union[int, Decimal]:
    """
    Find the least number such that when divided by divisor[i], 
    it leaves a difference (divisor - target_remainder) constant across them.
    Logic: LCM(divisors) - constant_difference
    """
    if len(divisors) != len(target_remainders):
        raise ValueError("Divisors and target remainders must match in length")
    
    differences = [int(d) - int(r) for d, r in zip(divisors, target_remainders)]
    if not all(diff == differences[0] for diff in differences):
        raise ValueError("The difference between divisor and respective remainder must be constant")
    
    common_diff = differences[0]
    lcm_val = lcm(*divisors)
    return lcm_val - common_diff
        

        
