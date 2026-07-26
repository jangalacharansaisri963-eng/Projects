# ==========================================
# SIMPLE INTEREST CALCULATOR TERMINAL
# Version 1.0
# ==========================================


def calculate_simple_interest(principal, rate, time):
    interest = (principal * rate * time) / 100
    amount = principal + interest

    return interest, amount


print("=" * 45)
print("       SIMPLE INTEREST CALCULATOR")
print("              Version 1.0")
print("=" * 45)


while True:

    try:
        print("\nEnter details:")

        principal = float(input("Principal Amount: "))
        rate = float(input("Rate of Interest (%): "))
        time = float(input("Time (Years): "))

        interest, amount = calculate_simple_interest(
            principal, rate, time
        )

        print("\n========== RESULT ==========")
        print(f"Simple Interest: {interest:.2f}")
        print(f"Total Amount: {amount:.2f}")
        print("============================")

    except ValueError:
        print("\nInvalid input! Enter numbers only.")

    choice = input("\nContinue? (y/n): ").lower()

    if choice != "y":
        print("\nThank you for using Simple Interest Calculator!")
        break