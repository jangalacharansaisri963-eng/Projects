import time

print("========== Countdown Timer ==========")


def countdown(seconds):

    while seconds > 0:

        mins = seconds // 60
        secs = seconds % 60

        print(f"\rTime Left: {mins:02}:{secs:02}", end="")

        time.sleep(1)

        seconds -= 1

    print("\rTime Left: 00:00")
    print("\n⏰ TIME'S UP!")


while True:

    try:

        print("""
1. Seconds
2. Minutes
3. Exit
""")

        choice = input("Choice: ")

        if choice == "3":
            print("Goodbye!")
            break

        elif choice == "1":

            seconds = int(input("Enter seconds: "))

        elif choice == "2":

            minutes = int(input("Enter minutes: "))
            seconds = minutes * 60

        else:
            print("Invalid choice.")
            continue

        input("\nPress Enter to start...")

        countdown(seconds)

        again = input("\nContinue? (y/n): ").lower()

        if again != "y":
            print("Goodbye!")
            break

    except ValueError:

        print("Please enter a valid number.")