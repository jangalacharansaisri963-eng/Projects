# math_engine.py
import math
import cmath
import re
from fractions import Fraction

def inject_implicit_mul(expr):
    """Cleans expressions by injecting explicit multiplication signs."""
    expr = re.sub(r'(\d)\(', r'\1*(', expr)
    expr = re.sub(r'\)\(', r')*(', expr)
    expr = re.sub(r'(\d)([a-z])', r'\1*\2', expr)
    return expr

def percent(x, y):
    return (x / 100) * y

def pi_precision(n):
    return round(math.pi, int(n))

def smart_sqrt(x):
    if x >= 0:
        return math.sqrt(x)
    return cmath.sqrt(x)

def format_result(res):
    if isinstance(res, complex):
        real_part = 0 if math.isclose(res.real, 0, abs_tol=1e-15) else res.real
        imag_part = 0 if math.isclose(res.imag, 0, abs_tol=1e-15) else res.imag
        
        if imag_part == 0:
            return int(real_part) if real_part.is_integer() else real_part
        elif real_part == 0:
            if imag_part == 1: return "i"
            if imag_part == -1: return "-i"
            return f"{int(imag_part) if imag_part.is_integer() else imag_part}i"
        else:
            sign = "+" if imag_part > 0 else "-"
            val = abs(imag_part)
            val_str = "" if val == 1 else (int(val) if val.is_integer() else val)
            r_str = int(real_part) if real_part.is_integer() else real_part
            return f"{r_str} {sign} {val_str}i"
    elif isinstance(res, (int, float)):
        if math.isclose(res, 0, abs_tol=1e-15):
            return 0
        elif res.is_integer():
            return int(res)
    return res

def smart_sin(x):
    res = math.sin(x)
    return 0 if math.isclose(res, 0, abs_tol=1e-15) else res

def smart_cos(x):
    res = math.cos(x)
    return 0 if math.isclose(res, 0, abs_tol=1e-15) else res

def smart_tan(x):
    cosine = smart_cos(x)
    if cosine == 0:
        raise ValueError("Undefined (Tangent asymptote)")
    res = math.tan(x)
    return 0 if math.isclose(res, 0, abs_tol=1e-15) else res

# The namespace dictionary mapping string inputs to safe math entities
SAFE_DICT = {
    "sqrt": smart_sqrt,
    "cbrt": math.cbrt,      
    "pi": pi_precision,     
    "pow": math.pow,      
    "percent": percent,    
    "sin": smart_sin,      
    "cos": smart_cos,      
    "tan": smart_tan,      
    "radians": math.radians,
    "degrees": math.degrees,
    "log": math.log10,      
    "ln": math.log          
}
