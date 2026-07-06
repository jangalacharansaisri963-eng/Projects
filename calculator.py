import math
import cmath
import os
import re

def clear_screen():
    """Clears the terminal screen for Windows or Linux/Android."""
    os.system('cls' if os.name == 'nt' else 'clear')

def calculator():
    print("--- Professional Calculator ---")
    print("Features: +, -, *, /, sqrt(x), cbrt(x), pi(n), pi, pow(x, y), percent(x, y), sin(x), cos(x), tan(x), radians(x), degrees(x)")
    print("Commands: 'ans' (last result), 'clear' (wipe screen), 'exit' (close)")
    
    # Initialize the Ans memory buffer tracker
    ans_value = 0

    # Custom helper for percentage calculations
    def percent(x, y):
        return (x / 100) * y

    # Custom helper for pi with specified decimal precision: pi(n)
    def pi_precision(n):
        return round(math.pi, int(n))

    # Smart square root handler to support complex numbers
    def smart_sqrt(x):
        if x >= 0:
            return math.sqrt(x)
        else:
            return cmath.sqrt(x)

    # Formatter to beautifully display complex outputs using 'i' instead of 'j'
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

    # Smart trig functions to cleanly handle floating-point rounding artifacts
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
    safe_dict = {
        "sqrt": smart_sqrt,     # <-- Swapped for complex-aware sqrt module
        "cbrt": math.cbrt,      
        "pi": pi_precision,     
        "pow": math.pow,      
        "percent": percent,    
        "sin": smart_sin,      
        "cos": smart_cos,      
        "tan": smart_tan,      
        "radians": math.radians,
        "degrees": math.degrees 
    }

    while True:
        try:
            expr = input("\n> ").lower().strip()
            
            # Handle exit conditions
            if expr in ["exit", "quit"]:
                print("Goodbye!")
                break
                
            # Handle an empty input gracefully
            if not expr:
                continue

            # Handle screen clear command
            if expr in ["clear", "cls"]:
                clear_screen()
                continue

            # --- BUFF 1: Replace 'ans' with the actual stored memory value ---
            expr = re.sub(r'\bans\b', str(ans_value), expr)

            # Special Case: If user types just 'pi' without brackets, return raw representation
            if expr == "pi":
                result = math.pi
                print(f"= {format(result, '.30f')}")
                ans_value = result  # Update ans even for raw pi calls
                continue

            # --- BUFF 2: Smart Implicit Multiplication Injector ---
            expr = re.sub(r'(\d)\(', r'\1*(', expr)
            expr = re.sub(r'\)\(', r')*(', expr)
            expr = re.sub(r'(\d)([a-z])', r'\1*\2', expr)

            # Build a local dictionary where 'pi' acts as a static constant value
            local_dict = {"pi": math.pi}
            
            # Safe parsing execution context
            result = eval(expr, {"__builtins__": None}, {**safe_dict, **local_dict})
            
            # Clean up and clean format outputs using our custom handler
            output = format_result(result)

            print(f"= {output}")
            
            # Save final successful calculation back into the Ans buffer
            ans_value = result
            
        except ZeroDivisionError:
            print("Undefined")
        except NameError:
            print("Error: Unknown function or variable used.")
        except TypeError:
            print("Error: Invalid argument layout or missing brackets.")
        except ValueError as e:
            print(f"Error: {e}")
        except Exception as e:
            # Check if eval blew up specifically due to a hidden division by zero in float math
            if "division by zero" in str(e).lower():
                print("Undefined")
            else:
                print(f"Error: Invalid syntax.")

if __name__ == "__main__":
    calculator()
    
