print("=== Leap Year Checker ===")

while True:
    year = int(input("Year: "))

    if (year % 400 == 0) or (year % 4 == 0 and year % 100 != 0):
        print(f"{year} is a leap year.")
    else:
        print(f"{year} is not a leap year.")

    again = input("\nContinue? (y/n): ").lower()

    if again != "y":
        print("Goodbye!")
        break