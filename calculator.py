import os
import re
import base64
import cmath
import math
from decimal import Decimal, getcontext
from deep_translator import GoogleTranslator

# --- CONFIG ---
getcontext().prec = 105

# --- MATH ENGINE ---
def inject_implicit_mul(expr):
    expr = re.sub(r'(\d)\(', r'\1*(', expr)
    expr = re.sub(r'\)\(', r')*(', expr)
    expr = re.sub(r'(\d)([a-z])', r'\1*\2', expr)
    return expr

def get_high_precision_pi():
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
    e = Decimal(1); fact = Decimal(1)
    for i in range(1, 70): fact *= Decimal(i); e += Decimal(1) / fact
    return e

# --- TRIG & LOG FUNCTIONS ---
def smart_sin(deg):
    x = (Decimal(deg) * get_high_precision_pi() / Decimal(180)) % (2 * get_high_precision_pi())
    result, term, num, denom, sign = Decimal(0), x, x, 1, 1
    for i in range(1, 45):
        result += sign * term; num *= x * x; denom *= (2 * i) * (2 * i + 1)
        term = num / Decimal(denom); sign *= -1
    return result

def smart_cos(deg):
    x = (Decimal(deg) * get_high_precision_pi() / Decimal(180)) % (2 * get_high_precision_pi())
    result, term, num, denom, sign = Decimal(0), Decimal(1), Decimal(1), 1, 1
    for i in range(1, 45):
        result += sign * term; num *= x * x; denom *= (2 * i - 1) * (2 * i)
        term = num / Decimal(denom); sign *= -1
    return result

def smart_tan(deg): return smart_sin(deg) / smart_cos(deg)
def smart_ln(x):
    x = Decimal(x); res = Decimal(str(cmath.log(float(x)).real)); e = get_high_precision_e()
    for _ in range(7): res = res + (x / (e ** res)) - Decimal(1)
    return res

def smart_log(x): return smart_ln(x) / smart_ln(10)
def smart_sqrt(x): return Decimal(x).sqrt()

# --- THE MASTER ROUTER ---
def main():
    print("--- Professional Quantum Terminal (Full Suite) ---")
    
    # Register full library
    MATH_LIB = {
        "sin": smart_sin, "cos": smart_cos, "tan": smart_tan,
        "pi": get_high_precision_pi(), "ln": smart_ln, "log": smart_log,
        "sqrt": smart_sqrt, "Decimal": Decimal
    }
    
    ans = "0"
    while True:
        try:
            cmd = input("core@quantum_matrix:~$ ").strip()
            if cmd.lower() in ["exit", "quit"]: break
            
            # Precise Toggle Detection
            is_precise = " precise" in cmd.lower()
            cmd = cmd.replace(" precise", "").replace(" PRECISE", "").strip()
            getcontext().prec = 105 if is_precise else 12

            # Routing
            if "(func translate to " in cmd:
                # [Translation Logic Remains Same]
                pass
            else:
                expr = inject_implicit_mul(cmd)
                result = eval(expr, {"__builtins__": None}, MATH_LIB)
                
                # Dynamic Output
                if not is_precise:
                    print(f"= {round(float(result), 10)}")
                else:
                    print(f"= {result}")
        except Exception as e:
            print(f" >> ERROR: {e}")

if __name__ == "__main__":
    main()
    
