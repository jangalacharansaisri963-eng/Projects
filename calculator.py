# calculator.py
import math
import os
import re
from fractions import Fraction
from math_engine import SAFE_DICT, inject_implicit_mul, format_result

def clear_screen():
    """Clears the terminal screen for Windows or Linux/Android."""
    os.system('cls' if os.name == 'nt' else 'clear')

def calculator():
    print("--- Professional Calculator ---")
    print("Features: +, -, *, /, sqrt(x), cbrt(x), pi(n), pi, pow(x, y), percent(x, y)")
    print("Trig (Degrees Natively): sin(x), cos(x), tan(x), sec(x), csc(x), cot(x), log(x), ln(x)")
    print("Commands: 'ans' (last result), 'clear' (wipe screen), 'exit' (close)")
    
    ans_value = 0

    while True:
        try:
            expr = input("\n> ").lower().strip()
            
            if expr in ["exit", "quit"]:
                print("Goodbye!")
                break
            if not expr:
                continue
            if expr in ["clear", "cls"]:
                clear_screen()
                continue

            # Replace 'ans' with the actual stored memory value
            expr = re.sub(r'\bans\b', str(ans_value), expr)

            # --- Intercept FR(start, end) count pattern ---
            fr_match = re.match(r'^fr\(([^,]+),([^)]+)\)\s+(\d+)$', expr)
            if fr_match:
                start_expr = fr_match.group(1).strip()
                end_expr = fr_match.group(2).strip()
                count = int(fr_match.group(3))
                
                if count <= 0:
                    print("Error: Count must be 1 or greater.")
                    continue
                
                start_expr = inject_implicit_mul(start_expr)
                end_expr = inject_implicit_mul(end_expr)

                local_dict = {"pi": math.pi}
                eval_env = {**SAFE_DICT, **local_dict}
                
                start_val = float(eval(start_expr, {"__builtins__": None}, eval_env))
                end_val = float(eval(end_expr, {"__builtins__": None}, eval_env))
                
                step = (end_val - start_val) / (count + 1)
                rational_numbers = []
                
                for i in range(1, count + 1):
                    current_val = start_val + (step * i)
                    frac = Fraction(current_val).limit_denominator(1000)
                    
                    if frac.denominator == 1:
                        rational_numbers.append(str(frac.numerator))
                    else:
                        rational_numbers.append(f"{frac.numerator}/{frac.denominator}")
                        
                result_str = f"[{', '.join(rational_numbers)}]"
                print(f"= {result_str}")
                ans_value = result_str
                continue

            if expr == "pi":
                result = math.pi
                print(f"= {format(result, '.30f')}")
                ans_value = result
                continue

            expr = inject_implicit_mul(expr)
            local_dict = {"pi": math.pi}
            
            result = eval(expr, {"__builtins__": None}, {**SAFE_DICT, **local_dict})
            
            output = format_result(result)
            print(f"= {output}")
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
            if "division by zero" in str(e).lower():
                print("Undefined")
            else:
                print(f"Error: Invalid syntax.")

if __name__ == "__main__":
    calculator()
    
