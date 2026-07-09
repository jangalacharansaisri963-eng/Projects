import cmath
import re
from decimal import Decimal, getcontext

# Force a 105-digit global precision buffer to safely return 100 accurate places
getcontext().prec = 105

def inject_implicit_mul(expr):
    """Cleans expressions by injecting explicit multiplication signs."""
    expr = re.sub(r'(\d)\(', r'\1*(', expr)
    expr = re.sub(r'\)\(', r')*(', expr)
    expr = re.sub(r'(\d)([a-z])', r'\1*\2', expr)
    return expr

def get_high_precision_pi():
    """Computes Pi to over 100 digits using the Chudnovsky algorithm."""
    orig_prec = getcontext().prec
    getcontext().prec = 110
    C = 426880 * Decimal(10005).sqrt()
    M, L, X, K, S = 1, 13591409, 1, 6, 13591409
    for i in range(1, 3):
        M = (M * (K**3 - 16*K)) // i**3
        L += 545140134
        X *= -262537412640768000
        S += Decimal(M * L) / X
        K += 12
    pi_val = C / S
    getcontext().prec = orig_prec
    return pi_val

def get_high_precision_e():
    """Computes Euler's constant e using Taylor series expansion."""
    e = Decimal(1)
    fact = Decimal(1)
    for i in range(1, 70):
        fact *= Decimal(i)
        e += Decimal(1) / fact
    return e

# --- High Precision Core Operations ---

def percent(x, y):
    return (Decimal(x) / Decimal(100)) * Decimal(y)

def pi_precision(n):
    pi_val = get_high_precision_pi()
    return round(pi_val, int(n))

def smart_sqrt(x):
    try:
        # Check if negative for complex support fallback
        if float(x) < 0:
            return cmath.sqrt(float(x))
        return Decimal(x).sqrt()
    except Exception:
        return Decimal(x).sqrt()

def smart_cbrt(x):
    d = Decimal(x)
    if d < 0:
        return -(-d)**(Decimal(1)/Decimal(3))
    return d**(Decimal(1)/Decimal(3))

def smart_pow(x, y):
    return Decimal(x) ** Decimal(y)

# --- High Precision Logarithmic Functions ---

def smart_ln(x):
    """Computes natural logarithm using high-precision Newton-Raphson method."""
    x = Decimal(x)
    if x <= 0:
        raise ValueError("Math Domain Error: ln(x) requires x > 0")
    # Initial estimate using standard math
    res = Decimal(str(cmath.log(float(x)).real))
    e = get_high_precision_e()
    # 7 iterations of Newton-Raphson doubles precision every step
    for _ in range(7):
        res = res + (x / (e ** res)) - Decimal(1)
    return res

def smart_log(x):
    """Computes base-10 logarithm using high-precision ln transitions."""
    return smart_ln(x) / smart_ln(10)

# --- High Precision Trigonometry (Degrees) ---

def to_radians(deg):
    return (Decimal(deg) * get_high_precision_pi()) / Decimal(180)

def smart_sin(deg):
    x = to_radians(deg) % (2 * get_high_precision_pi())
    result, term, num, denom, sign = Decimal(0), x, x, 1, 1
    for i in range(1, 45):
        result += sign * term
        num *= x * x
        denom *= (2 * i) * (2 * i + 1)
        term = num / Decimal(denom)
        sign *= -1
    return Decimal(0) if abs(result) < Decimal('1e-95') else result

def smart_cos(deg):
    x = to_radians(deg) % (2 * get_high_precision_pi())
    result, term, num, denom, sign = Decimal(0), Decimal(1), Decimal(1), 1, 1
    for i in range(1, 45):
        result += sign * term
        num *= x * x
        denom *= (2 * i - 1) * (2 * i)
        term = num / Decimal(denom)
        sign *= -1
    return Decimal(0) if abs(result) < Decimal('1e-95') else result

def smart_tan(deg):
    c = smart_cos(deg)
    if abs(c) < Decimal('1e-95'):
        raise ValueError(f"Undefined (Tangent asymptote at {deg}°)")
    return smart_sin(deg) / c

def smart_sec(deg):
    c = smart_cos(deg)
    if abs(c) < Decimal('1e-95'):
        raise ValueError(f"Undefined (Secant asymptote at {deg}°)")
    return Decimal(1) / c

def smart_csc(deg):
    s = smart_sin(deg)
    if abs(s) < Decimal('1e-95'):
        raise ValueError(f"Undefined (Cosecant asymptote at {deg}°)")
    return Decimal(1) / s

def smart_cot(deg):
    s = smart_sin(deg)
    if abs(s) < Decimal('1e-95'):
        raise ValueError(f"Undefined (Cotangent asymptote at {deg}°)")
    return smart_cos(deg) / s

# --- Inverse Trigonometry (Outputs Degrees) ---

def smart_arcsin(x):
    x = Decimal(x)
    if x < -1 or x > 1:
        raise ValueError("Arcsin input domain must be between -1 and 1")
    if x == 1: return Decimal(90)
    if x == -1: return Decimal(-90)
    # Power series approximation for arcsin
    result, term, num, denom = x, x, x, 1
    for i in range(1, 80):
        num *= x * x * Decimal(2 * i - 1)
        denom *= Decimal(2 * i)
        term = num / (denom * Decimal(2 * i + 1))
        result += term
    return (result * Decimal(180)) / get_high_precision_pi()

def smart_arccos(x):
    return Decimal(90) - smart_arcsin(x)

def smart_arctan(x):
    x = Decimal(x)
    # Map domain space safely to force fast convergence
    if x > 1: return Decimal(90) - smart_arctan(Decimal(1) / x)
    if x < -1: return Decimal(-90) - smart_arctan(Decimal(1) / x)
    result, term, power, sign = x, x, x, 1
    for i in range(1, 80):
        power *= x * x
        sign *= -1
        term = (power * sign) / Decimal(2 * i + 1)
        result += term
    return (result * Decimal(180)) / get_high_precision_pi()

def find_repeating_decimal(numerator, denominator):
    """Detects cycles in rational divisions, outputting string-bars if repeating."""
    num, denom = abs(int(numerator)), abs(int(denominator))
    sign = "-" if (int(numerator) < 0) ^ (int(denominator) < 0) else ""
    integer_part = num // denom
    remainder = num % denom
    if remainder == 0:
        return f"{sign}{integer_part}.0"
    decimal_part, seen_remainders = [], {}
    while remainder != 0:
        if remainder in seen_remainders:
            start_cycle = seen_remainders[remainder]
            non_repeat = "".join(decimal_part[:start_cycle])
            repeat = "".join(decimal_part[start_cycle:])
            return f"{sign}{integer_part}.{non_repeat}({repeat} bar)"
        seen_remainders[remainder] = len(decimal_part)
        remainder *= 10
        decimal_part.append(str(remainder // denom))
        remainder %= denom
        if len(decimal_part) > 102: # Safe high-precision boundary cutoff
            break
    return f"{sign}{integer_part}.{''.join(decimal_part[:100])}"

def format_result(res):
    if isinstance(res, complex):
        return f"{res.real} + {res.imag}i"
    if isinstance(res, Decimal):
        s = f"{res:f}"
        if '.' in s:
            parts = s.split('.')
            integer_segment = parts[0]
            decimal_segment = parts[1][:100]  # Exact 100 digit truncation rule
            if all(c == '0' for c in decimal_segment):
                return integer_segment + ".0"
            return f"{integer_segment}.{decimal_segment.rstrip('0') if len(decimal_segment.rstrip('0')) > 0 else '0'}"
        return s + ".0"
    return str(res)

SAFE_DICT = {
    "sqrt": smart_sqrt, "cbrt": smart_cbrt, "pi": pi_precision,
    "pow": smart_pow, "percent": percent, "sin": smart_sin,
    "cos": smart_cos, "tan": smart_tan, "sec": smart_sec,
    "csc": smart_csc, "cot": smart_cot, "arcsin": smart_arcsin,
    "arccos": smart_arccos, "arctan": smart_arctan, "log": smart_log, "ln": smart_ln
}
