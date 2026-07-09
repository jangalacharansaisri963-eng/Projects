import os
import re
from decimal import Decimal, getcontext
from math_engine import SAFE_DICT, inject_implicit_mul, format_result, find_repeating_decimal, get_high_precision_pi

# Align runtime evaluation precisions
getcontext().prec = 105

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def calculator():
    print("--- Professional 100-Digit Calculator ---")
    print("Features: +, -, *, /, sqrt(x), cbrt(x), pi(n), pi, pow(x, y), percent(x, y)")
    print("Trig: sin(x), cos(x), tan(x), sec(x), csc(x), cot(x), arcsin(x), arccos(x), arctan(x)")
    print("Logs: log(x) [Base-10], ln(x) [Natural]")
    print("Rational Number Range Generator: fr(start, end) count")
    print("Commands: 'ans', 'clear', 'exit'\n")
    
    ans_value = "0"

    while True:
        try:
            expr = input("> ").lower().strip()
            if expr in ["exit", "quit"]:
                print("Goodbye!")
                break
            if not expr:
                continue
            if expr in ["clear", "cls"]:
                clear_screen()
                continue

            expr = re.sub(r'\bans\b', str(ans_value), expr)

            # --- High Precision Rational Range Generator Engine ---
            fr_match = re.match(r'^fr\(([^,]+),([^)]+)\)\s+(\d+)$', expr)
            if fr_match:
                start_expr = inject_implicit_mul(fr_match.group(1).strip())
                end_expr = inject_implicit_mul(fr_match.group(2).strip())
                count = int(fr_match.group(3))
                
                if count <= 0:
                    print("Error: Count must be 1 or greater.")
                    continue
                
                eval_env = {**SAFE_DICT, "pi": get_high_precision_pi()}
                # Evaluate range limits natively as direct high-precision decimals
                start_val = Decimal(str(eval(start_expr, {"__builtins__": None}, eval_env)))
                end_val = Decimal(str(eval(end_expr, {"__builtins__": None}, eval_env)))
                
                step = (end_val - start_val) / Decimal(count + 1)
                rational_numbers = []
                
                for i in range(1, count + 1):
                    current_val = start_val + (step * Decimal(i))
                    # Extract high precision ratio fractions directly via division parsing
                    frac = current_val.as_integer_ratio()
                    if frac[1] == 1:
                        rational_numbers.append(str(frac[0]))
                    else:
                        # Feed directly into repeating bar engine logic check
                        rational_numbers.append(find_repeating_decimal(frac[0], frac[1]))
                        
                result_str = f"[{', '.join(rational_numbers)}]"
                print(f"= {result_str}")
                ans_value = result_str
                continue

            # Standard Fraction Division Intercept Check (e.g. "1/3" or "div(1,3)")
            div_match = re.match(r'^(\d+)\s*/\s*(\d+)$', expr)
            if div_match:
                output = find_repeating_decimal(div_match.group(1), div_match.group(2))
                print(f"= {output}")
                ans_value = output
                continue

            if expr == "pi":
                output = format_result(get_high_precision_pi())
                print(f"= {output}")
                ans_value = output
                continue

            # Evaluate general high-precision equations
            expr = inject_implicit_mul(expr)
            eval_env = {**SAFE_DICT, "pi": get_high_precision_pi()}
            
            result = eval(expr, {"__builtins__": None}, eval_env)
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
                print("Error: Invalid syntax.")

if __name__ == "__main__":
    calculator()
            
