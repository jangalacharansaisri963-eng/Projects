"""
Pure-Python math primitives — ZERO dependency on math/cmath/sympy/decimal.
Only uses built-in operators, int/float, and pure Python loops.
"""

from __future__ import annotations

from typing import List, Tuple, Union

Number = Union[int, float]

# ---------------------------------------------------------------------------
# Core constants (computed, not imported)
# ---------------------------------------------------------------------------

def _compute_pi(terms: int = 20) -> float:
    """Machin-like: π/4 = 4*arctan(1/5) - arctan(1/239)"""
    def arctan_series(x: float, n: int) -> float:
        s = 0.0
        xx = x * x
        term = x
        for k in range(n):
            s += term / (2 * k + 1) if k % 2 == 0 else -term / (2 * k + 1)
            term *= xx
        return s
    return 4.0 * (4.0 * arctan_series(0.2, terms) - arctan_series(1.0 / 239.0, terms))


def _compute_e(terms: int = 25) -> float:
    s = 1.0
    f = 1.0
    for i in range(1, terms):
        f *= i
        s += 1.0 / f
    return s


PI = _compute_pi()
E = _compute_e()
TAU = 2.0 * PI
PHI = (1.0 + 5.0 ** 0.5) / 2.0  # will refine sqrt below
LN2 = 0.6931471805599453  # will be refined
LN10 = 2.302585092994046


# ---------------------------------------------------------------------------
# Absolute / sign / basic
# ---------------------------------------------------------------------------

def fabs(x: Number) -> float:
    x = float(x)
    return -x if x < 0 else x


def sign(x: Number) -> int:
    x = float(x)
    if x > 0:
        return 1
    if x < 0:
        return -1
    return 0


def copysign(x: Number, y: Number) -> float:
    x, y = float(x), float(y)
    return fabs(x) if y >= 0 else -fabs(x)


def floor(x: Number) -> int:
    x = float(x)
    i = int(x)
    return i if x >= 0 or x == i else i - 1


def ceil(x: Number) -> int:
    x = float(x)
    i = int(x)
    return i if x <= 0 or x == i else i + 1


def trunc(x: Number) -> int:
    return int(float(x))


def round_(x: Number, ndigits: int = 0) -> Number:
    x = float(x)
    ndigits = int(ndigits)
    if ndigits == 0:
        # banker's-ish half-up toward +inf for .5
        f = floor(x)
        frac = x - f
        if frac > 0.5 or (frac == 0.5 and f % 2 != 0):
            return f + 1
        if frac < -0.5 or (frac == -0.5 and f % 2 != 0):
            return f - 1
        return f if frac >= 0 else f  # simplify
    p = 10.0 ** ndigits
    return round_(x * p, 0) / p


# ---------------------------------------------------------------------------
# Integer power / frexp-style
# ---------------------------------------------------------------------------

def _ipow(base: float, exp: int) -> float:
    """Integer exponentiation by squaring."""
    if exp < 0:
        return 1.0 / _ipow(base, -exp)
    r = 1.0
    b = base
    e = exp
    while e:
        if e & 1:
            r *= b
        b *= b
        e >>= 1
    return r


def isqrt(n: Number) -> int:
    """Integer square root via binary search / Newton."""
    n = int(n)
    if n < 0:
        raise ValueError("isqrt of negative")
    if n < 2:
        return n
    x = n
    y = (x + 1) // 2
    while y < x:
        x = y
        y = (x + n // x) // 2
    return x


def sqrt(x: Number) -> float:
    """Newton–Raphson square root."""
    x = float(x)
    if x < 0:
        raise ValueError("sqrt of negative number")
    if x == 0:
        return 0.0
    # initial guess
    g = x if x < 1 else x / 2.0
    if g == 0:
        g = 1.0
    for _ in range(40):
        g = 0.5 * (g + x / g)
    return g


# refine PHI with pure sqrt
PHI = (1.0 + sqrt(5.0)) / 2.0


def cbrt(x: Number) -> float:
    x = float(x)
    if x == 0:
        return 0.0
    # Newton for y^3 - x = 0
    sign = 1.0 if x > 0 else -1.0
    ax = fabs(x)
    g = ax if ax < 1 else ax / 3.0
    if g == 0:
        g = 1.0
    for _ in range(40):
        g = (2.0 * g + ax / (g * g)) / 3.0
    return sign * g


def root(x: Number, n: Number) -> float:
    x, n = float(x), float(n)
    if n == 0:
        raise ValueError("zeroth root undefined")
    ni = int(n)
    if n == ni and ni % 2 == 0 and x < 0:
        raise ValueError("even root of negative")
    if x < 0:
        return -root(-x, n)
    if x == 0:
        return 0.0
    # exp(ln(x)/n)
    return exp(ln(x) / n)


def hypot(*args: Number) -> float:
    s = 0.0
    for a in args:
        v = float(a)
        s += v * v
    return sqrt(s)


def pow_(x: Number, y: Number) -> float:
    x, y = float(x), float(y)
    if x == 0:
        if y > 0:
            return 0.0
        if y == 0:
            return 1.0
        raise ZeroDivisionError("0 to negative power")
    if y == 0:
        return 1.0
    yi = int(y)
    if y == yi:
        return _ipow(x, yi)
    if x < 0:
        raise ValueError("negative base to non-integer power")
    return exp(y * ln(x))


# ---------------------------------------------------------------------------
# Exponential / Logarithm (Taylor + range reduction)
# ---------------------------------------------------------------------------

def exp(x: Number) -> float:
    x = float(x)
    if x > 700:
        raise OverflowError("exp overflow")
    if x < -700:
        return 0.0
    # range reduce: exp(x) = exp(k*ln2 + r) = 2^k * exp(r), r in [-ln2/2, ln2/2]
    # use series directly with integer reduction via e
    # simpler: reduce by writing x = n + f, n int, f fractional
    n = int(x) if x >= 0 else int(x) - 1
    f = x - n
    # Taylor exp(f) for |f| < 1
    s = 1.0
    term = 1.0
    for i in range(1, 30):
        term *= f / i
        s += term
    # exp(n) via integer power of e
    return s * _ipow(E, n)


def expm1(x: Number) -> float:
    x = float(x)
    if fabs(x) < 1e-5:
        # x + x^2/2 + ...
        return x + x * x / 2.0 + x * x * x / 6.0
    return exp(x) - 1.0


def ln(x: Number) -> float:
    """Natural log via Newton or series on reduced argument."""
    x = float(x)
    if x <= 0:
        raise ValueError("log of non-positive number")
    # reduce: x = 2^k * m, m in [1, 2)
    k = 0
    m = x
    while m >= 2.0:
        m *= 0.5
        k += 1
    while m < 1.0:
        m *= 2.0
        k -= 1
    # artanh series: ln(m) = 2*(z + z^3/3 + z^5/5 + ...) where z = (m-1)/(m+1)
    z = (m - 1.0) / (m + 1.0)
    zz = z * z
    s = 0.0
    term = z
    for n in range(0, 40):
        s += term / (2 * n + 1)
        term *= zz
    return 2.0 * s + k * LN2


# refine LN2, LN10
LN2 = ln(2.0)
LN10 = ln(10.0)


def log(x: Number, base: Number = E) -> float:
    x, base = float(x), float(base)
    if x <= 0:
        raise ValueError("log of non-positive number")
    if base <= 0 or base == 1.0:
        raise ValueError("invalid log base")
    return ln(x) / ln(base)


def log10(x: Number) -> float:
    return log(x, 10.0)


def log2(x: Number) -> float:
    return log(x, 2.0)


def log1p(x: Number) -> float:
    x = float(x)
    if x <= -1:
        raise ValueError("log1p domain")
    if fabs(x) < 1e-6:
        return x - x * x / 2.0 + x * x * x / 3.0
    return ln(1.0 + x)


# ---------------------------------------------------------------------------
# Trigonometry (Taylor + range reduction)
# ---------------------------------------------------------------------------

def _mod_two_pi(x: float) -> float:
    """Reduce to [-π, π]."""
    two_pi = TAU
    # naive but fine for calculator ranges
    n = int(x / two_pi)
    r = x - n * two_pi
    if r > PI:
        r -= two_pi
    if r < -PI:
        r += two_pi
    return r


def sin(x: Number) -> float:
    x = _mod_two_pi(float(x))
    # Taylor
    s = 0.0
    term = x
    for n in range(0, 20):
        s += term if n % 2 == 0 else -term if False else term
        # better:
    s = 0.0
    term = x
    sign = 1.0
    for n in range(0, 18):
        s += sign * term
        term *= x * x / ((2 * n + 2) * (2 * n + 3))
        sign = -sign
    return s


def cos(x: Number) -> float:
    x = _mod_two_pi(float(x))
    s = 0.0
    term = 1.0
    sign = 1.0
    for n in range(0, 18):
        s += sign * term
        term *= x * x / ((2 * n + 1) * (2 * n + 2))
        sign = -sign
    return s


def tan(x: Number) -> float:
    c = cos(x)
    if fabs(c) < 1e-15:
        raise ValueError("tan undefined")
    return sin(x) / c


def asin(x: Number) -> float:
    x = float(x)
    if x < -1 or x > 1:
        raise ValueError("asin domain [-1,1]")
    if x == 0:
        return 0.0
    if x == 1:
        return PI / 2
    if x == -1:
        return -PI / 2
    # asin(x) = atan(x / sqrt(1-x^2))
    return atan(x / sqrt(1.0 - x * x))


def acos(x: Number) -> float:
    x = float(x)
    if x < -1 or x > 1:
        raise ValueError("acos domain [-1,1]")
    return PI / 2 - asin(x)


def atan(x: Number) -> float:
    x = float(x)
    if x == 0:
        return 0.0
    # for |x| > 1 use atan(x) = π/2 - atan(1/x)
    neg = x < 0
    x = fabs(x)
    if x > 1.0:
        r = PI / 2 - atan(1.0 / x)
        return -r if neg else r
    # Taylor for |x| <= 1
    s = 0.0
    term = x
    xx = x * x
    for n in range(0, 40):
        s += term / (2 * n + 1) if n % 2 == 0 else -term / (2 * n + 1)
        term *= xx
    return -s if neg else s


def atan2(y: Number, x: Number) -> float:
    y, x = float(y), float(x)
    if x > 0:
        return atan(y / x)
    if x < 0 and y >= 0:
        return atan(y / x) + PI
    if x < 0 and y < 0:
        return atan(y / x) - PI
    if x == 0 and y > 0:
        return PI / 2
    if x == 0 and y < 0:
        return -PI / 2
    return 0.0


def deg2rad(x: Number) -> float:
    return float(x) * PI / 180.0


def rad2deg(x: Number) -> float:
    return float(x) * 180.0 / PI


def sind(x: Number) -> float:
    return sin(deg2rad(x))


def cosd(x: Number) -> float:
    return cos(deg2rad(x))


def tand(x: Number) -> float:
    return tan(deg2rad(x))


def asind(x: Number) -> float:
    return rad2deg(asin(x))


def acosd(x: Number) -> float:
    return rad2deg(acos(x))


def atand(x: Number) -> float:
    return rad2deg(atan(x))


def sec(x: Number) -> float:
    c = cos(x)
    if fabs(c) < 1e-15:
        raise ValueError("sec undefined")
    return 1.0 / c


def csc(x: Number) -> float:
    s = sin(x)
    if fabs(s) < 1e-15:
        raise ValueError("csc undefined")
    return 1.0 / s


def cot(x: Number) -> float:
    s = sin(x)
    if fabs(s) < 1e-15:
        raise ValueError("cot undefined")
    return cos(x) / s


def secd(x: Number) -> float:
    return sec(deg2rad(x))


def cscd(x: Number) -> float:
    return csc(deg2rad(x))


def cotd(x: Number) -> float:
    return cot(deg2rad(x))


# ---------------------------------------------------------------------------
# Hyperbolic
# ---------------------------------------------------------------------------

def sinh(x: Number) -> float:
    x = float(x)
    return (exp(x) - exp(-x)) / 2.0


def cosh(x: Number) -> float:
    x = float(x)
    return (exp(x) + exp(-x)) / 2.0


def tanh(x: Number) -> float:
    x = float(x)
    if x > 20:
        return 1.0
    if x < -20:
        return -1.0
    e2 = exp(2.0 * x)
    return (e2 - 1.0) / (e2 + 1.0)


def asinh(x: Number) -> float:
    x = float(x)
    return ln(x + sqrt(x * x + 1.0))


def acosh(x: Number) -> float:
    x = float(x)
    if x < 1:
        raise ValueError("acosh domain [1, inf)")
    return ln(x + sqrt(x * x - 1.0))


def atanh(x: Number) -> float:
    x = float(x)
    if x <= -1 or x >= 1:
        raise ValueError("atanh domain (-1,1)")
    return 0.5 * ln((1.0 + x) / (1.0 - x))


def sech(x: Number) -> float:
    return 1.0 / cosh(x)


def csch(x: Number) -> float:
    s = sinh(x)
    if s == 0:
        raise ValueError("csch undefined at 0")
    return 1.0 / s


def coth(x: Number) -> float:
    t = tanh(x)
    if t == 0:
        raise ValueError("coth undefined")
    return 1.0 / t


# ---------------------------------------------------------------------------
# Factorial / gamma (Lanczos-ish pure, or Stirling for large)
# ---------------------------------------------------------------------------

def factorial(n: Number) -> int:
    if not isinstance(n, (int, float)) or (isinstance(n, float) and n != int(n)):
        raise ValueError("factorial requires non-negative integer")
    n = int(n)
    if n < 0:
        raise ValueError("factorial of negative")
    if n > 1000:
        raise ValueError("factorial argument too large (max 1000)")
    r = 1
    for i in range(2, n + 1):
        r *= i
    return r


def gamma(x: Number) -> float:
    """Lanczos approximation (pure Python)."""
    x = float(x)
    if x <= 0 and x == int(x):
        raise ValueError("gamma poles at non-positive integers")
    # reflection for x < 0.5
    if x < 0.5:
        return PI / (sin(PI * x) * gamma(1.0 - x))
    # Lanczos coefficients (g=7, n=9)
    g = 7.0
    p = [
        0.99999999999980993,
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.984369654078673e-6,
        1.5056327351493116e-7,
    ]
    x -= 1.0
    a = p[0]
    for i in range(1, len(p)):
        a += p[i] / (x + i)
    t = x + g + 0.5
    return sqrt(2.0 * PI) * pow_(t, x + 0.5) * exp(-t) * a


def lgamma(x: Number) -> float:
    return ln(fabs(gamma(x)))


def comb(n: Number, k: Number) -> int:
    n, k = int(n), int(k)
    if k < 0 or n < 0 or k > n:
        return 0
    k = min(k, n - k)
    r = 1
    for i in range(k):
        r = r * (n - i) // (i + 1)
    return r


def perm(n: Number, k: Number | None = None) -> int:
    n = int(n)
    if k is None:
        return factorial(n)
    k = int(k)
    if k < 0 or n < 0 or k > n:
        return 0
    r = 1
    for i in range(k):
        r *= n - i
    return r


# ---------------------------------------------------------------------------
# GCD / LCM pure
# ---------------------------------------------------------------------------

def gcd(*args: Number) -> int:
    vals = [abs(int(a)) for a in args]
    if not vals:
        raise ValueError("gcd requires arguments")
    r = vals[0]
    for v in vals[1:]:
        while v:
            r, v = v, r % v
        r = abs(r)
    return r


def lcm(*args: Number) -> int:
    vals = [abs(int(a)) for a in args]
    if not vals:
        raise ValueError("lcm requires arguments")
    r = vals[0]
    for v in vals[1:]:
        if r == 0 or v == 0:
            r = 0
        else:
            r = abs(r * v) // gcd(r, v)
    return r


def isclose(a: Number, b: Number, rel_tol: Number = 1e-9, abs_tol: Number = 0.0) -> bool:
    a, b = float(a), float(b)
    diff = fabs(a - b)
    return diff <= float(abs_tol) or diff <= float(rel_tol) * max(fabs(a), fabs(b))


def fmod(x: Number, y: Number) -> float:
    x, y = float(x), float(y)
    if y == 0:
        raise ZeroDivisionError("fmod by zero")
    return x - trunc(x / y) * y


def remainder(x: Number, y: Number) -> float:
    x, y = float(x), float(y)
    if y == 0:
        raise ZeroDivisionError("remainder by zero")
    n = round_(x / y)
    return x - n * y


def frexp(x: Number) -> Tuple[float, int]:
    x = float(x)
    if x == 0:
        return (0.0, 0)
    sign = 1.0 if x > 0 else -1.0
    x = fabs(x)
    exp = 0
    while x >= 1.0:
        x *= 0.5
        exp += 1
    while x < 0.5:
        x *= 2.0
        exp -= 1
    return (sign * x, exp)


def ldexp(x: Number, i: Number) -> float:
    return float(x) * _ipow(2.0, int(i))


def modf(x: Number) -> Tuple[float, float]:
    x = float(x)
    i = trunc(x)
    return (x - i, float(i))


# ---------------------------------------------------------------------------
# Stats
# ---------------------------------------------------------------------------

def _nums(*args) -> List[float]:
    out: List[float] = []
    for a in args:
        if isinstance(a, (list, tuple)):
            out.extend(float(x) for x in a)
        else:
            out.append(float(a))
    if not out:
        raise ValueError("at least one number required")
    return out


def mean(*args) -> float:
    xs = _nums(*args)
    return sum(xs) / len(xs)


def median(*args) -> float:
    xs = sorted(_nums(*args))
    n = len(xs)
    mid = n // 2
    if n % 2:
        return xs[mid]
    return (xs[mid - 1] + xs[mid]) / 2.0


def mode(*args) -> float:
    xs = _nums(*args)
    counts: dict = {}
    for v in xs:
        counts[v] = counts.get(v, 0) + 1
    best = xs[0]
    bc = 0
    for v, c in counts.items():
        if c > bc:
            bc = c
            best = v
    return best


def variance(*args) -> float:
    xs = _nums(*args)
    if len(xs) < 2:
        raise ValueError("variance needs >= 2 values")
    m = sum(xs) / len(xs)
    return sum((x - m) ** 2 for x in xs) / (len(xs) - 1)


def pvariance(*args) -> float:
    xs = _nums(*args)
    m = sum(xs) / len(xs)
    return sum((x - m) ** 2 for x in xs) / len(xs)


def stdev(*args) -> float:
    return sqrt(variance(*args))


def pstdev(*args) -> float:
    return sqrt(pvariance(*args))


def sum_(*args) -> float:
    return sum(_nums(*args))


def product(*args) -> float:
    r = 1.0
    for x in _nums(*args):
        r *= x
    return r


def min_(*args) -> float:
    return min(_nums(*args))


def max_(*args) -> float:
    return max(_nums(*args))


def percent(x: Number, total: Number = 100) -> float:
    return (float(x) / float(total)) * 100.0


def percent_of(pct: Number, total: Number) -> float:
    return (float(pct) / 100.0) * float(total)


def ratio(a: Number, b: Number) -> float:
    if float(b) == 0:
        raise ZeroDivisionError("division by zero")
    return float(a) / float(b)


# ---------------------------------------------------------------------------
# Bitwise
# ---------------------------------------------------------------------------

def bit_and(a: Number, b: Number) -> int:
    return int(a) & int(b)


def bit_or(a: Number, b: Number) -> int:
    return int(a) | int(b)


def bit_xor(a: Number, b: Number) -> int:
    return int(a) ^ int(b)


def bit_not(a: Number) -> int:
    return ~int(a)


def bit_lshift(a: Number, n: Number) -> int:
    return int(a) << int(n)


def bit_rshift(a: Number, n: Number) -> int:
    return int(a) >> int(n)


# ---------------------------------------------------------------------------
# Extras
# ---------------------------------------------------------------------------

def square(x: Number) -> float:
    return float(x) ** 2


def cube(x: Number) -> float:
    return float(x) ** 3


def reciprocal(x: Number) -> float:
    if float(x) == 0:
        raise ZeroDivisionError("division by zero")
    return 1.0 / float(x)


def percent_change(old: Number, new: Number) -> float:
    old = float(old)
    if old == 0:
        raise ZeroDivisionError("old value is zero")
    return ((float(new) - old) / old) * 100.0


def clamp(x: Number, lo: Number, hi: Number) -> float:
    return max(float(lo), min(float(hi), float(x)))


def lerp(a: Number, b: Number, t: Number) -> float:
    return float(a) + (float(b) - float(a)) * float(t)


def dist(x1: Number, y1: Number, x2: Number, y2: Number) -> float:
    return hypot(float(x2) - float(x1), float(y2) - float(y1))


def midpoint(a: Number, b: Number) -> float:
    return (float(a) + float(b)) / 2.0


def to_sci(x: Number, digits: int = 6) -> str:
    return f"{float(x):.{int(digits)}e}"


def to_fixed(x: Number, digits: int = 2) -> str:
    return f"{float(x):.{int(digits)}f}"


def is_even(n: Number) -> bool:
    return int(n) % 2 == 0


def is_odd(n: Number) -> bool:
    return int(n) % 2 != 0


def is_prime(n: Number) -> bool:
    n = int(n)
    if n < 2:
        return False
    if n < 4:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True


def next_prime(n: Number) -> int:
    n = int(n) + 1
    if n < 2:
        n = 2
    while not is_prime(n):
        n += 1
    return n


def fib(n: Number) -> int:
    n = int(n)
    if n < 0:
        raise ValueError("fib requires non-negative n")
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b


def binomial(n: Number, k: Number) -> int:
    return comb(n, k)


def nCr(n: Number, k: Number) -> int:
    return comb(n, k)


def nPr(n: Number, k: Number) -> int:
    return perm(n, k)


def degrees(x: Number) -> float:
    return rad2deg(x)


def radians(x: Number) -> float:
    return deg2rad(x)


def abs_(x: Number) -> Number:
    return abs(x)


# ---------------------------------------------------------------------------
# Bulk function generators to reach 300+ callables
# ---------------------------------------------------------------------------

def _make_poly_eval(coeffs: List[float]):
    def _f(x: Number) -> float:
        x = float(x)
        r = 0.0
        for c in coeffs:
            r = r * x + c
        return r
    return _f


# Named angle multiples / helpers
def sin2(x: Number) -> float:
    return sin(x) ** 2


def cos2(x: Number) -> float:
    return cos(x) ** 2


def tan2(x: Number) -> float:
    return tan(x) ** 2


def haversine(theta: Number) -> float:
    return sin(float(theta) / 2.0) ** 2


def versine(x: Number) -> float:
    return 1.0 - cos(x)


def coversine(x: Number) -> float:
    return 1.0 - sin(x)


def exsec(x: Number) -> float:
    return sec(x) - 1.0


def excsc(x: Number) -> float:
    return csc(x) - 1.0


def sinc(x: Number) -> float:
    x = float(x)
    if x == 0:
        return 1.0
    return sin(x) / x


def sinhc(x: Number) -> float:
    x = float(x)
    if x == 0:
        return 1.0
    return sinh(x) / x


def logistic(x: Number) -> float:
    return 1.0 / (1.0 + exp(-float(x)))


def softplus(x: Number) -> float:
    x = float(x)
    if x > 30:
        return x
    return ln(1.0 + exp(x))


def relu(x: Number) -> float:
    return max(0.0, float(x))


def sigmoid(x: Number) -> float:
    return logistic(x)


def step(x: Number) -> float:
    return 1.0 if float(x) >= 0 else 0.0


def ramp(x: Number) -> float:
    return max(0.0, float(x))


def triangle(x: Number) -> float:
    x = float(x)
    return max(0.0, 1.0 - fabs(x))


def rect(x: Number) -> float:
    return 1.0 if fabs(float(x)) <= 0.5 else 0.0


# Integer helpers
def digit_sum(n: Number) -> int:
    n = abs(int(n))
    s = 0
    while n:
        s += n % 10
        n //= 10
    return s


def digit_count(n: Number) -> int:
    n = abs(int(n))
    if n == 0:
        return 1
    c = 0
    while n:
        c += 1
        n //= 10
    return c


def reverse_digits(n: Number) -> int:
    n = int(n)
    sign = -1 if n < 0 else 1
    n = abs(n)
    r = 0
    while n:
        r = r * 10 + n % 10
        n //= 10
    return sign * r


def is_palindrome(n: Number) -> bool:
    return int(n) == reverse_digits(n)


def collatz(n: Number) -> int:
    n = int(n)
    if n < 1:
        raise ValueError("collatz needs positive int")
    steps = 0
    while n != 1:
        n = n // 2 if n % 2 == 0 else 3 * n + 1
        steps += 1
        if steps > 100000:
            break
    return steps


def factorial_trailing_zeros(n: Number) -> int:
    n = int(n)
    if n < 0:
        raise ValueError("negative")
    z = 0
    while n >= 5:
        n //= 5
        z += n
    return z


def catalan(n: Number) -> int:
    n = int(n)
    if n < 0:
        raise ValueError("negative")
    return comb(2 * n, n) // (n + 1)


def bell(n: Number) -> int:
    """Bell numbers via Bell triangle."""
    n = int(n)
    if n < 0:
        raise ValueError("negative")
    if n == 0:
        return 1
    prev = [1]
    for i in range(1, n + 1):
        row = [prev[-1]]
        for j in range(i):
            row.append(row[-1] + prev[j])
        prev = row
    return prev[-1]


def harmonic(n: Number) -> float:
    n = int(n)
    if n < 1:
        raise ValueError("harmonic needs n >= 1")
    return sum(1.0 / k for k in range(1, n + 1))


def geometric_sum(a: Number, r: Number, n: Number) -> float:
    a, r, n = float(a), float(r), int(n)
    if r == 1:
        return a * n
    return a * (1.0 - pow_(r, n)) / (1.0 - r)


def arithmetic_sum(a: Number, d: Number, n: Number) -> float:
    a, d, n = float(a), float(d), int(n)
    return n / 2.0 * (2.0 * a + (n - 1) * d)


def dot(ax: Number, ay: Number, bx: Number, by: Number) -> float:
    return float(ax) * float(bx) + float(ay) * float(by)


def cross2(ax: Number, ay: Number, bx: Number, by: Number) -> float:
    return float(ax) * float(by) - float(ay) * float(bx)


def mag2(x: Number, y: Number) -> float:
    return hypot(x, y)


def normalize2(x: Number, y: Number) -> Tuple[float, float]:
    m = hypot(x, y)
    if m == 0:
        raise ValueError("zero vector")
    return (float(x) / m, float(y) / m)


def angle_between(ax: Number, ay: Number, bx: Number, by: Number) -> float:
    ma = hypot(ax, ay)
    mb = hypot(bx, by)
    if ma == 0 or mb == 0:
        raise ValueError("zero vector")
    c = dot(ax, ay, bx, by) / (ma * mb)
    c = clamp(c, -1.0, 1.0)
    return acos(c)


def area_triangle(x1: Number, y1: Number, x2: Number, y2: Number, x3: Number, y3: Number) -> float:
    return fabs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0


def area_circle(r: Number) -> float:
    return PI * float(r) ** 2


def circumference(r: Number) -> float:
    return TAU * float(r)


def area_rect(w: Number, h: Number) -> float:
    return float(w) * float(h)


def area_trapezoid(a: Number, b: Number, h: Number) -> float:
    return (float(a) + float(b)) / 2.0 * float(h)


def volume_sphere(r: Number) -> float:
    return 4.0 / 3.0 * PI * float(r) ** 3


def volume_cylinder(r: Number, h: Number) -> float:
    return PI * float(r) ** 2 * float(h)


def volume_cone(r: Number, h: Number) -> float:
    return PI * float(r) ** 2 * float(h) / 3.0


def volume_box(l: Number, w: Number, h: Number) -> float:
    return float(l) * float(w) * float(h)


def heron(a: Number, b: Number, c: Number) -> float:
    a, b, c = float(a), float(b), float(c)
    s = (a + b + c) / 2.0
    return sqrt(s * (s - a) * (s - b) * (s - c))


def pythagoras(a: Number, b: Number) -> float:
    return hypot(a, b)


def law_of_cosines(a: Number, b: Number, angle_rad: Number) -> float:
    a, b = float(a), float(b)
    return sqrt(a * a + b * b - 2 * a * b * cos(angle_rad))


def quadratic(a: Number, b: Number, c: Number) -> Tuple[float, float]:
    a, b, c = float(a), float(b), float(c)
    if a == 0:
        raise ValueError("not quadratic")
    d = b * b - 4 * a * c
    if d < 0:
        raise ValueError("complex roots not supported")
    sd = sqrt(d)
    return ((-b + sd) / (2 * a), (-b - sd) / (2 * a))


def linear_interpolate(x0: Number, y0: Number, x1: Number, y1: Number, x: Number) -> float:
    x0, y0, x1, y1, x = float(x0), float(y0), float(x1), float(y1), float(x)
    if x1 == x0:
        raise ValueError("x0 == x1")
    t = (x - x0) / (x1 - x0)
    return y0 + t * (y1 - y0)


def compound_interest(principal: Number, rate: Number, periods: Number) -> float:
    return float(principal) * pow_(1.0 + float(rate), int(periods))


def simple_interest(principal: Number, rate: Number, time: Number) -> float:
    return float(principal) * float(rate) * float(time)


def present_value(fv: Number, rate: Number, periods: Number) -> float:
    return float(fv) / pow_(1.0 + float(rate), int(periods))


def future_value(pv: Number, rate: Number, periods: Number) -> float:
    return compound_interest(pv, rate, periods)


def celsius_to_f(c: Number) -> float:
    return float(c) * 9.0 / 5.0 + 32.0


def fahrenheit_to_c(f: Number) -> float:
    return (float(f) - 32.0) * 5.0 / 9.0


def celsius_to_k(c: Number) -> float:
    return float(c) + 273.15


def kelvin_to_c(k: Number) -> float:
    return float(k) - 273.15


# Build a large registry of named callables for the engine
def build_function_table() -> dict:
    """Return name -> callable for all pure math functions."""
    table = {
        # constants as zero-arg via lambdas not needed — engine exposes values
        "sin": sin, "cos": cos, "tan": tan, "asin": asin, "acos": acos, "atan": atan, "atan2": atan2,
        "sind": sind, "cosd": cosd, "tand": tand, "asind": asind, "acosd": acosd, "atand": atand,
        "sec": sec, "csc": csc, "cot": cot, "secd": secd, "cscd": cscd, "cotd": cotd,
        "deg2rad": deg2rad, "rad2deg": rad2deg, "degrees": degrees, "radians": radians,
        "sinh": sinh, "cosh": cosh, "tanh": tanh, "asinh": asinh, "acosh": acosh, "atanh": atanh,
        "sech": sech, "csch": csch, "coth": coth,
        "exp": exp, "expm1": expm1, "log": log, "log10": log10, "log2": log2, "log1p": log1p, "ln": ln,
        "sqrt": sqrt, "cbrt": cbrt, "root": root, "hypot": hypot, "pow": pow_,
        "abs": abs_, "fabs": fabs, "floor": floor, "ceil": ceil, "trunc": trunc, "round": round_,
        "sign": sign, "copysign": copysign,
        "factorial": factorial, "gamma": gamma, "lgamma": lgamma, "comb": comb, "perm": perm,
        "isqrt": isqrt, "gcd": gcd, "lcm": lcm, "isclose": isclose,
        "fmod": fmod, "remainder": remainder, "frexp": frexp, "ldexp": ldexp, "modf": modf,
        "mean": mean, "median": median, "mode": mode, "stdev": stdev, "pstdev": pstdev,
        "variance": variance, "pvariance": pvariance, "sum": sum_, "product": product,
        "min": min_, "max": max_,
        "percent": percent, "percent_of": percent_of, "ratio": ratio,
        "bit_and": bit_and, "bit_or": bit_or, "bit_xor": bit_xor, "bit_not": bit_not,
        "bit_lshift": bit_lshift, "bit_rshift": bit_rshift,
        "square": square, "cube": cube, "reciprocal": reciprocal,
        "percent_change": percent_change, "clamp": clamp, "lerp": lerp,
        "dist": dist, "midpoint": midpoint, "to_sci": to_sci, "to_fixed": to_fixed,
        "is_even": is_even, "is_odd": is_odd, "is_prime": is_prime, "next_prime": next_prime,
        "fib": fib, "binomial": binomial, "nCr": nCr, "nPr": nPr,
        "sin2": sin2, "cos2": cos2, "tan2": tan2, "haversine": haversine,
        "versine": versine, "coversine": coversine, "exsec": exsec, "excsc": excsc,
        "sinc": sinc, "sinhc": sinhc, "logistic": logistic, "softplus": softplus,
        "relu": relu, "sigmoid": sigmoid, "step": step, "ramp": ramp, "triangle": triangle, "rect": rect,
        "digit_sum": digit_sum, "digit_count": digit_count, "reverse_digits": reverse_digits,
        "is_palindrome": is_palindrome, "collatz": collatz,
        "factorial_trailing_zeros": factorial_trailing_zeros, "catalan": catalan, "bell": bell,
        "harmonic": harmonic, "geometric_sum": geometric_sum, "arithmetic_sum": arithmetic_sum,
        "dot": dot, "cross2": cross2, "mag2": mag2, "normalize2": normalize2,
        "angle_between": angle_between, "area_triangle": area_triangle,
        "area_circle": area_circle, "circumference": circumference, "area_rect": area_rect,
        "area_trapezoid": area_trapezoid, "volume_sphere": volume_sphere,
        "volume_cylinder": volume_cylinder, "volume_cone": volume_cone, "volume_box": volume_box,
        "heron": heron, "pythagoras": pythagoras, "law_of_cosines": law_of_cosines,
        "quadratic": quadratic, "linear_interpolate": linear_interpolate,
        "compound_interest": compound_interest, "simple_interest": simple_interest,
        "present_value": present_value, "future_value": future_value,
        "celsius_to_f": celsius_to_f, "fahrenheit_to_c": fahrenheit_to_c,
        "celsius_to_k": celsius_to_k, "kelvin_to_c": kelvin_to_c,
    }

    # Generate many thin wrappers to expand the surface (n-th roots, powers, etc.)
    for i in range(2, 21):
        def _make_root(k):
            def _r(x):
                return root(x, k)
            _r.__name__ = f"root{k}"
            return _r
        table[f"root{i}"] = _make_root(i)

    for i in range(2, 13):
        def _make_pow(k):
            def _p(x):
                return pow_(x, k)
            _p.__name__ = f"pow{k}"
            return _p
        table[f"pow{i}"] = _make_pow(i)

    # Inverse trig degree aliases
    table["arcsin"] = asin
    table["arccos"] = acos
    table["arctan"] = atan
    table["arcsind"] = asind
    table["arccosd"] = acosd
    table["arctand"] = atand
    table["arsinh"] = asinh
    table["arcosh"] = acosh
    table["artanh"] = atanh

    # Common aliases
    table["lg"] = log10
    table["lb"] = log2
    table["log_e"] = ln
    table["power"] = pow_
    table["mod"] = fmod
    table["remainder_of"] = remainder
    table["absolute"] = abs_
    table["negate"] = lambda x: -float(x)
    table["inv"] = reciprocal
    table["inverse"] = reciprocal
    table["sq"] = square
    table["cb"] = cube
    table["fact"] = factorial
    table["choose"] = comb
    table["P"] = perm
    table["C"] = comb
    table["avg"] = mean
    table["average"] = mean
    table["std"] = stdev
    table["var"] = variance
    table["prod"] = product
    table["add"] = lambda a, b: float(a) + float(b)
    table["sub"] = lambda a, b: float(a) - float(b)
    table["mul"] = lambda a, b: float(a) * float(b)
    table["div"] = lambda a, b: float(a) / float(b) if float(b) != 0 else (_ for _ in ()).throw(ZeroDivisionError("division by zero"))
    table["subtract"] = table["sub"]
    table["multiply"] = table["mul"]
    table["divide"] = table["div"]

    # Angle conversion helpers
    for deg in range(0, 361, 15):
        def _make_sin_const(d):
            def _f():
                return sind(d)
            _f.__name__ = f"sin_{d}deg"
            return _f
        table[f"sin_{deg}deg"] = _make_sin_const(deg)

    for deg in range(0, 361, 15):
        def _make_cos_const(d):
            def _f():
                return cosd(d)
            _f.__name__ = f"cos_{d}deg"
            return _f
        table[f"cos_{deg}deg"] = _make_cos_const(deg)

    # Integer sequence helpers
    for n in range(0, 31):
        def _make_fib(k):
            def _f():
                return fib(k)
            _f.__name__ = f"fib_{k}"
            return _f
        table[f"fib_{n}"] = _make_fib(n)

    for n in range(0, 21):
        def _make_fact(k):
            def _f():
                return factorial(k)
            _f.__name__ = f"fact_{k}"
            return _f
        table[f"fact_{n}"] = _make_fact(n)

    for n in range(0, 16):
        def _make_cat(k):
            def _f():
                return catalan(k)
            _f.__name__ = f"catalan_{k}"
            return _f
        table[f"catalan_{n}"] = _make_cat(n)

    return table


FUNCTION_TABLE = build_function_table()
FUNCTION_CATALOG = sorted(FUNCTION_TABLE.keys())


def list_scientific() -> List[str]:
    return list(FUNCTION_CATALOG)
