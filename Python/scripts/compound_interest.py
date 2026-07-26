# ==========================================
# COMPOUND INTEREST CALCULATOR TERMINAL
# Version 1.0
# ==========================================

import math


def calculate_compound_interest(principal, rate, time):
    amount = principal * math.pow((1 + rate / 100), time)
    interest = amount - principal

    return interest, amount


print("=" * 50)
print("      COMPOUND INTEREST CALCULATOR")
print("              Version 1.0")
print("=" * 50)


while True:

    try:
        print("\nEnter details:")

        principal = float(input("Principal Amount: "))
        rate = float(input("Rate of Interest (%): "))
        time = float(input("Time (Years): "))

        interest, amount = calculate_compound_interest(
            principal, rate, time
        )

        print("\n========== RESULT ==========")
        print(f"Compound Interest: {interest:.2f}")
        print(f"Final Amount: {amount:.2f}")
        print("============================")

    except ValueError:
        print("\nInvalid input! Enter numbers only.")

    choice = input("\nContinue? (y/n): ").lower()

    if choice != "y":
        print("\nThank you for using Compound Interest Calculator!")
        break