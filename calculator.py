import math

def calculator():
    print("--- Professional Calculator ---")
    print("Features: +, -, *, /, sqrt(x), pi(n), pi, pow(x, y), percent(x, y)")
    print("Type 'exit' or 'quit' to close.")
    
    # Custom operations
    def percent(x, y):
        # Calculates x percent of y
        return (x / 100) * y

    safe_dict = {
        "sqrt": math.sqrt,
        "pi": math.pi,
        "pow": math.pow,      # Use as pow(2, 3) for 2^3
        "percent": percent,    # Use as percent(20, 500) for 20% of 500
        "sin": math.sin,
        "cos": math.cos,
        "tan": math.tan,
        "radians": math.radians
    }

    while True:
        try:
            expr = input("\n> ").lower().strip()
            
            if expr in ["exit", "quit"]:
                print("Goodbye!")
                break
            
            # Special case for 30-digit pi
            if expr == "pi":
                print(f"= {format(math.pi, '.30f')}")
                continue
            
            # Evaluate expression safely
            result = eval(expr, {"__builtins__": None}, safe_dict)
            print(f"= {result}")
            
        except ZeroDivisionError:
            print("Error: Cannot divide by zero.")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    calculator()
    
