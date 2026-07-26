# ==========================================
# AGE CALCULATOR TERMINAL
# Version 1.0
# ==========================================

from datetime import date


def calculate_age(day, month, year):
    today = date.today()

    birth_date = date(year, month, day)

    years = today.year - birth_date.year
    months = today.month - birth_date.month
    days = today.day - birth_date.day

    if days < 0:
        months -= 1
        days += 30

    if months < 0:
        years -= 1
        months += 12

    total_days = (today - birth_date).days
    total_months = years * 12 + months

    return years, months, days, total_months, total_days


print("=" * 40)
print("        AGE CALCULATOR TERMINAL")
print("             Version 1.0")
print("=" * 40)


while True:

    try:
        print("\nEnter your birth date:")

        day = int(input("Day: "))
        month = int(input("Month: "))
        year = int(input("Year: "))

        age, extra_months, extra_days, total_months, total_days = calculate_age(
            day, month, year
        )

        print("\n========== RESULT ==========")
        print(f"Age: {age} years, {extra_months} months, {extra_days} days")
        print(f"Total Months: {total_months}")
        print(f"Total Days: {total_days}")
        print("============================")

    except ValueError:
        print("\nInvalid date entered!")

    choice = input("\nContinue? (y/n): ").lower()

    if choice != "y":
        print("\nThank you for using Age Calculator!")
        break