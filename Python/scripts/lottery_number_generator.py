import random

history = []


def help_menu():
    print("""
========== Help ==========

Commands:

1 - Quick Pick
2 - Lucky Number
3 - View History
4 - About
5 - Exit

==========================
""")


def about():
    print("""
========== About ==========

Lottery Number Generator
Version 1.0

Generates 6 unique lottery numbers
and 1 bonus number.

==========================
""")


print("========== Lottery Number Generator ==========")

while True:

    print("""
1. Quick Pick
2. Lucky Number
3. View History
4. About
5. Exit
""")

    choice = input("Choice: ")

    if choice == "1":

        numbers = sorted(random.sample(range(1, 50), 6))

        bonus = random.randint(1, 49)

        while bonus in numbers:
            bonus = random.randint(1, 49)

        history.append((numbers, bonus))

        print("\n========== Your Numbers ==========")

        print("Main Numbers:")

        for number in numbers:
            print(number)

        print(f"\nBonus Ball: {bonus}")

        print("==============================")

    elif choice == "2":

        print(f"\n🍀 Lucky Number: {random.randint(1,99)}")

    elif choice == "3":

        if len(history) == 0:
            print("\nNo history available.")

        else:

            print("\n========== History ==========")

            for i, draw in enumerate(history, 1):

                print(f"\nDraw {i}")

                print("Numbers:", draw[0])

                print("Bonus :", draw[1])

    elif choice == "4":

        about()

    elif choice == "5":

        print("Goodbye!")
        break

    else:

        print("Invalid option.")
        continue

    again = input("\nContinue? (y/n): ").lower()

    if again != "y":
        print("Goodbye!")
        break