import math
import sys

# --- Number-theoretic and Representation Functions ---
def comb(n, k): return math.comb(int(n), int(k))
def factorial(n): return math.factorial(int(n))
def gcd(*integers): return math.gcd(*(int(i) for i in integers))
def isqrt(n): return math.isqrt(int(n))
def lcm(*integers): return math.lcm(*(int(i) for i in integers))
def perm(n, k): return math.perm(int(n), int(k))

# --- Floating Point and Arithmetic Functions ---
def ceil(x): return math.ceil(float(x))
def fabs(x): return math.fabs(float(x))
def floor(x): return math.floor(float(x))
def fma(x, y, z): return math.fma(float(x), float(y), float(z))
def fmod(x, y): return math.fmod(float(x), float(y))
def modf(x): return math.modf(float(x))
def remainder(x, y): return math.remainder(float(x), float(y))
def trunc(x): return math.trunc(float(x))

# --- Floating Point Manipulation ---
def copysign(x, y): return math.copysign(float(x), float(y))
def frexp(x): return math.frexp(float(x))
def isclose(a, b, rel_tol=1e-09, abs_tol=0.0): return math.isclose(float(a), float(b), rel_tol=float(rel_tol), abs_tol=float(abs_tol))
def isfinite(x): return math.isfinite(float(x))
def isinf(x): return math.isinf(float(x))
def isnan(x): return math.isnan(float(x))
def ldexp(x, i): return math.ldexp(float(x), int(i))
def nextafter(x, y, steps=1): return math.nextafter(float(x), float(y), steps=int(steps))
def ulp(x): return math.ulp(float(x))

# --- Power, Exponential, and Logarithmic Functions ---
def cbrt(x): return math.cbrt(float(x))
def exp(x): return math.exp(float(x))
def exp2(x): return math.exp2(float(x))
def expm1(x): return math.expm1(float(x))
def log(x, base=math.e): return math.log(float(x), float(base))
def log1p(x): return math.log1p(float(x))
def log2(x): return math.log2(float(x))
def log10(x): return math.log10(float(x))
def pow(x, y): return math.pow(float(x), float(y))
def sqrt(x): return math.sqrt(float(x))

# --- Summation and Product Functions ---
def dist(p, q): return math.dist(p, q)
def fsum(iterable): return math.fsum(iterable)
def hypot(*coordinates): return math.hypot(*(float(c) for c in coordinates))
def prod(iterable, *, start=1): return math.prod(iterable, start=start)
def sumprod(p, q): return math.sumprod(p, q)

# --- Angular Conversion ---
def degrees(x): return math.degrees(float(x))
def radians(x): return math.radians(float(x))

# --- Trigonometric Functions ---
def acos(x): return math.acos(float(x))
def asin(x): return math.asin(float(x))
def atan(x): return math.atan(x)
def atan2(y, x): return math.atan2(float(y), float(x))
def cos(x): return math.cos(float(x))
def sin(x): return math.sin(float(x))
def tan(x): return math.tan(float(x))

# --- Hyperbolic Functions ---
def acosh(x): return math.acosh(float(x))
def asinh(x): return math.asinh(float(x))
def atanh(x): return math.atanh(float(x))
def cosh(x): return math.cosh(float(x))
def sinh(x): return math.sinh(float(x))
def tanh(x): return math.tanh(float(x))

# --- Special Functions ---
def erf(x): return math.erf(float(x))
def erfc(x): return math.erfc(float(x))
def gamma(x): return math.gamma(float(x))
def lgamma(x): return math.lgamma(float(x))


# --- Interactive CLI Calculator Interface ---
FUNCTIONS_MAP = {
    "comb": comb, "factorial": factorial, "gcd": gcd, "isqrt": isqrt, "lcm": lcm, "perm": perm,
    "ceil": ceil, "fabs": fabs, "floor": floor, "fma": fma, "fmod": fmod, "modf": modf, "remainder": remainder, "trunc": trunc,
    "copysign": copysign, "frexp": frexp, "isclose": isclose, "isfinite": isfinite, "isinf": isinf, "isnan": isnan, "ldexp": ldexp, "nextafter": nextafter, "ulp": ulp,
    "cbrt": cbrt, "exp": exp, "exp2": exp2, "expm1": expm1, "log": log, "log1p": log1p, "log2": log2, "log10": log10, "pow": pow, "sqrt": sqrt,
    "dist": dist, "fsum": fsum, "hypot": hypot, "prod": prod, "sumprod": sumprod,
    "degrees": degrees, "radians": radians,
    "acos": acos, "asin": asin, "atan": atan, "atan2": atan2, "cos": cos, "sin": sin, "tan": tan,
    "acosh": acosh, "asinh": asinh, "atanh": atanh, "cosh": cosh, "sinh": sinh, "tanh": tanh,
    "erf": erf, "erfc": erfc, "gamma": gamma, "lgamma": lgamma
}

def parse_input_arg(val_str):
    val_str = val_str.strip()
    # Handle list/tuple arguments like for dist, fsum, prod, etc.
    if val_str.startswith('[') or val_str.startswith('('):
        try:
            # Safely evaluate iterable strings like "[1, 2, 3]"
            return eval(val_str, {"__builtins__": None}, {})
        except Exception:
            pass
    
    # Try parsing as float or int
    try:
        if '.' in val_str or 'e' in val_str.lower():
            return float(val_str)
        return int(val_str)
    except ValueError:
        return val_str

def main():
    print("=" * 60)
    print("Python Math Module Interactive CLI Calculator")
    print("Type 'list' to see all available functions, or 'exit' to quit.")
    print("=" * 60)

    while True:
        try:
            cmd = input("\nMath Function> ").strip()
            if not cmd:
                continue
            if cmd.lower() in ('exit', 'quit'):
                print("Goodbye!")
                break
            if cmd.lower() == 'list':
                print("\nAvailable functions:")
                print(", ".join(sorted(FUNCTIONS_MAP.keys())))
                continue

            if cmd not in FUNCTIONS_MAP:
                print(f"Error: '{cmd}' is not a valid math function. Type 'list' for options.")
                continue

            arg_str = input(f"Enter arguments for {cmd} (separated by spaces or commas, e.g., '9' or '4, 2'): ")
            
            # Split arguments by comma or space
            if ',' in arg_str:
                raw_args = arg_str.split(',')
            else:
                raw_args = arg_str.split()

            args = [parse_input_arg(arg) for arg in raw_args if arg.strip() != '']

            # Call function safely
            func = FUNCTIONS_MAP[cmd]
            result = func(*args)
            print(f"Result: {result}")

        except Exception as e:
            print(f"Calculation Error: {e}")

if __name__ == "__main__":
    main()
