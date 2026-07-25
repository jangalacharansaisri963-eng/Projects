import calendar
from datetime import datetime

print("========== Calendar Viewer ==========")


def about():

    print("""
========== About ==========

Calendar Viewer
Version 1.0

Features:
- View Calendar
- Leap Year Checker
- Day Finder
- Current Date

==========================
""")


def help_menu():

    print("""
========== Help ==========

1 - View Month
2 - Leap Year
3 - Day Finder
4 - Today's Date
5 - About
6 - Exit

==========================
""")


while True:

    print("""
1. View Month
2. Leap Year
3. Day Finder
4. Today's Date
5. About
6. Exit
""")

    choice = input("Choice: ")

    if choice == "1":

        try:

            year = int(input("Year: "))
            month = int(input("Month (1-12): "))

            print()
            print(calendar.month(year, month))

        except:

            print("Invalid month or year.")

    elif choice == "2":

        year = int(input("Year: "))

        if calendar.isleap(year):
            print(f"\n{year} is a Leap Year.")
        else:
            print(f"\n{year} is NOT a Leap Year.")

    elif choice == "3":

        try:

            year = int(input("Year: "))
            month = int(input("Month: "))
            day = int(input("Day: "))

            weekday = datetime(year, month, day).strftime("%A")

            print(f"\nThat day is: {weekday}")

        except:

            print("Invalid date.")

    elif choice == "4":

        now = datetime.now()

        print("\nToday's Date")

        print(now.strftime("%A"))
        print(now.strftime("%d %B %Y"))
        print(now.strftime("%I:%M:%S %p"))

    elif choice == "5":

        about()

    elif choice == "6":

        print("Goodbye!")
        break

    elif choice.lower() == "help":

        help_menu()

    else:

        print("Invalid choice.")

    again = input("\nContinue? (y/n): ").lower()

    if again != "y":

        print("Goodbye!")
        break