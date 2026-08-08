import math
import re
from math import *

# --- Mathematical Constants ---
CONSTANTS = {
    "pi": math.pi,
    "e": math.e,
    "tau": math.tau,
    "inf": math.inf,
    "nan": math.nan,
    "phi": (1 + math.sqrt(5)) / 2,  # Golden ratio
    "sqrt2": math.sqrt(2),
    "sqrt3": math.sqrt(3),
}

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
def pow_func(x, y): return math.pow(float(x), float(y))
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
def atan(x): return math.atan(float(x))
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

# --- Additional Functions ---
def abs_val(x): return abs(float(x))
def min_val(*args): return min(*(float(a) for a in args))
def max_val(*args): return max(*(float(a) for a in args))
def round_val(x, n=0): return round(float(x), int(n))

# --- Functions Map ---
FUNCTIONS_MAP = {
    "comb": comb, "factorial": factorial, "gcd": gcd, "isqrt": isqrt, "lcm": lcm, "perm": perm,
    "ceil": ceil, "fabs": fabs, "floor": floor, "fma": fma, "fmod": fmod, "modf": modf, "remainder": remainder, "trunc": trunc,
    "copysign": copysign, "frexp": frexp, "isclose": isclose, "isfinite": isfinite, "isinf": isinf, "isnan": isnan, "ldexp": ldexp, "nextafter": nextafter, "ulp": ulp,
    "cbrt": cbrt, "exp": exp, "exp2": exp2, "expm1": expm1, "log": log, "log1p": log1p, "log2": log2, "log10": log10, "pow": pow_func, "sqrt": sqrt,
    "dist": dist, "fsum": fsum, "hypot": hypot, "prod": prod, "sumprod": sumprod,
    "degrees": degrees, "radians": radians,
    "acos": acos, "asin": asin, "atan": atan, "atan2": atan2, "cos": cos, "sin": sin, "tan": tan,
    "acosh": acosh, "asinh": asinh, "atanh": atanh, "cosh": cosh, "sinh": sinh, "tanh": tanh,
    "erf": erf, "erfc": erfc, "gamma": gamma, "lgamma": lgamma,
    "abs": abs_val, "min": min_val, "max": max_val, "round": round_val,
}

def tokenize(expression):
    """Tokenize mathematical expression into numbers, operators, and function calls."""
    tokens = []
    i = 0
    while i < len(expression):
        # Skip whitespace
        if expression[i].isspace():
            i += 1
            continue
        
        # Handle operators and parentheses
        if expression[i] in '+-*/%()^':
            tokens.append(expression[i])
            i += 1
        
        # Handle numbers (including decimals and scientific notation)
        elif expression[i].isdigit() or (expression[i] == '.' and i + 1 < len(expression) and expression[i + 1].isdigit()):
            j = i
            while j < len(expression) and (expression[j].isdigit() or expression[j] == '.'):
                j += 1
            if j < len(expression) and expression[j] in 'eE':
                j += 1
                if j < len(expression) and expression[j] in '+-':
                    j += 1
                while j < len(expression) and expression[j].isdigit():
                    j += 1
            tokens.append(('NUM', float(expression[i:j])))
            i = j
        
        # Handle constants and function names
        elif expression[i].isalpha() or expression[i] == '_':
            j = i
            while j < len(expression) and (expression[j].isalnum() or expression[j] == '_'):
                j += 1
            name = expression[i:j]
            if name in CONSTANTS:
                tokens.append(('CONST', CONSTANTS[name]))
            elif name in FUNCTIONS_MAP:
                tokens.append(('FUNC', name))
            else:
                raise ValueError(f"Unknown constant or function: {name}")
            i = j
        else:
            raise ValueError(f"Unexpected character: {expression[i]}")
    
    return tokens

def parse_expression(tokens, pos=0):
    """Parse tokens into an AST respecting PEMDAS/BODMAS."""
    def parse_addition(pos):
        left, pos = parse_multiplication(pos)
        while pos < len(tokens) and tokens[pos] in ['+', '-']:
            op = tokens[pos]
            pos += 1
            right, pos = parse_multiplication(pos)
            if op == '+':
                left = left + right
            else:
                left = left - right
        return left, pos
    
    def parse_multiplication(pos):
        left, pos = parse_exponentiation(pos)
        while pos < len(tokens) and tokens[pos] in ['*', '/', '%']:
            op = tokens[pos]
            pos += 1
            right, pos = parse_exponentiation(pos)
            if op == '*':
                left = left * right
            elif op == '/':
                if right == 0:
                    raise ValueError("Division by zero")
                left = left / right
            else:  # '%'
                left = left % right
        return left, pos
    
    def parse_exponentiation(pos):
        left, pos = parse_unary(pos)
        if pos < len(tokens) and tokens[pos] == '^':
            pos += 1
            right, pos = parse_exponentiation(pos)  # Right associative
            left = left ** right
        return left, pos
    
    def parse_unary(pos):
        if pos < len(tokens) and tokens[pos] == '-':
            pos += 1
            val, pos = parse_unary(pos)
            return -val, pos
        elif pos < len(tokens) and tokens[pos] == '+':
            pos += 1
            return parse_unary(pos)
        else:
            return parse_primary(pos)
    
    def parse_primary(pos):
        if pos >= len(tokens):
            raise ValueError("Unexpected end of expression")
        
        token = tokens[pos]
        
        # Number
        if isinstance(token, tuple) and token[0] == 'NUM':
            return token[1], pos + 1
        
        # Constant
        if isinstance(token, tuple) and token[0] == 'CONST':
            return token[1], pos + 1
        
        # Function call
        if isinstance(token, tuple) and token[0] == 'FUNC':
            func_name = token[1]
            pos += 1
            if pos >= len(tokens) or tokens[pos] != '(':
                raise ValueError(f"Expected '(' after function {func_name}")
            pos += 1
            
            # Parse function arguments
            args = []
            if pos < len(tokens) and tokens[pos] != ')':
                while True:
                    arg, pos = parse_addition(pos)
                    args.append(arg)
                    if pos < len(tokens) and tokens[pos] == ',':
                        pos += 1
                    else:
                        break
            
            if pos >= len(tokens) or tokens[pos] != ')':
                raise ValueError(f"Expected ')' to close function {func_name}")
            pos += 1
            
            func = FUNCTIONS_MAP[func_name]
            try:
                result = func(*args)
            except Exception as e:
                raise ValueError(f"Error calling {func_name}: {e}")
            return result, pos
        
        # Parenthesized expression
        if token == '(':
            pos += 1
            val, pos = parse_addition(pos)
            if pos >= len(tokens) or tokens[pos] != ')':
                raise ValueError("Expected ')'")
            pos += 1
            return val, pos
        
        raise ValueError(f"Unexpected token: {token}")
    
    result, pos = parse_addition(pos)
    if pos < len(tokens):
        raise ValueError(f"Unexpected token: {tokens[pos]}")
    return result

def evaluate(expression):
    """Evaluate a mathematical expression."""
    expression = expression.replace('^', '**').strip()
    tokens = tokenize(expression)
    return parse_expression(tokens)

def main():
    print("=" * 70)
    print("🧮 Python Math Module Advanced Interactive CLI Calculator")
    print("=" * 70)
    print("\n📝 Features:")
    print("  • Direct function syntax: gamma(4), sin(pi/2), sqrt(16)")
    print("  • Mathematical constants: pi, e, tau, phi, sqrt2, sqrt3")
    print("  • Operators: +, -, *, /, %, ^ (power)")
    print("  • PEMDAS/BODMAS: Automatic order of operations")
    print("  • Examples:")
    print("    - 2 + 3 * 4 = 14")
    print("    - sin(pi/2) = 1")
    print("    - 2^3 + sqrt(16) = 12")
    print("    - gamma(5) = 24")
    print("    - log(100, 10) = 2")
    print("\n💡 Commands:")
    print("  • 'constants' - List all constants")
    print("  • 'functions' - List all functions")
    print("  • 'help' - Show this help message")
    print("  • 'exit' or 'quit' - Exit calculator")
    print("=" * 70)

    while True:
        try:
            cmd = input("\n📐 > ").strip()
            
            if not cmd:
                continue
            
            if cmd.lower() in ('exit', 'quit'):
                print("\n👋 Goodbye!")
                break
            
            if cmd.lower() == 'help':
                print("\n" + "=" * 70)
                print("HELP - Advanced Calculator Commands")
                print("=" * 70)
                print("\n📝 Input Formats:")
                print("  Direct Expression: 2 + 3 * 4")
                print("  Functions: sin(pi/2), sqrt(16), gamma(5)")
                print("  Complex: (2 + 3) * sqrt(16) - pi")
                print("\n🔢 Supported Constants:")
                print(f"  {', '.join(sorted(CONSTANTS.keys()))}")
                print("\n⚙️  Supported Operations:")
                print("  + (addition), - (subtraction), * (multiplication)")
                print("  / (division), % (modulo), ^ (exponentiation)")
                continue
            
            if cmd.lower() == 'constants':
                print("\n📊 Available Constants:")
                for name, value in sorted(CONSTANTS.items()):
                    print(f"  {name:12} = {value}")
                continue
            
            if cmd.lower() == 'functions':
                print("\n🔧 Available Functions:")
                funcs = sorted(FUNCTIONS_MAP.keys())
                # Print in columns
                cols = 4
                for i in range(0, len(funcs), cols):
                    print("  " + ", ".join(f"{f:15}" for f in funcs[i:i+cols]))
                continue
            
            # Evaluate expression
            result = evaluate(cmd)
            
            # Format result
            if isinstance(result, float):
                if result == int(result):
                    print(f"✅ Result: {int(result)}")
                else:
                    print(f"✅ Result: {result:.10g}")
            else:
                print(f"✅ Result: {result}")
        
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
