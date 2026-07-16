"""
formatter.py

Terminal output.
"""

LINE = "━━━━━━━━━━━━━━━━━━━━━━"


def banner():

    print("===================================")
    print(" High Precision Scientific Calculator")
    print("===================================")
    print("Type 'exit' to quit.")
    print("Add 'precise' to any calculation for 105-digit precision.")
    print("Commands:")
    print("  mode degree")
    print("  mode radian")
    print("  fr(a,b) n")
    print()


def result(value, precise=False):

    print()
    print(LINE)
    print("Result")
    print(LINE)

    print(value)

    if precise:
        print("(Precise Mode)")

    print(LINE)
    print()


def error(message):

    print(f"Error: {message}")


def success(message):

    print(f">> {message}")
