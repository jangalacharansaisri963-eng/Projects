import time

start_time = None
running = False
laps = []


def help_menu():
    print("""
========== Help ==========

Commands:

start   - Start stopwatch
stop    - Stop stopwatch
lap     - Record lap time
reset   - Reset stopwatch
laps    - Show lap times
help    - Show help
about   - About program
exit    - Exit program

==========================
""")


def about():
    print("""
========== About ==========

Stopwatch Terminal
Version 1.0

Features:
- Start
- Stop
- Lap Times
- Reset

==========================
""")


print("========== Stopwatch ==========")
print("Type 'help' for commands.")

while True:

    command = input("\nCommand: ").lower().strip()

    if command == "help":
        help_menu()
        continue

    elif command == "about":
        about()
        continue

    elif command == "start":

        if running:
            print("Stopwatch is already running.")
            continue

        start_time = time.time()
        running = True
        print("Stopwatch started.")

    elif command == "lap":

        if not running:
            print("Start the stopwatch first.")
            continue

        elapsed = time.time() - start_time
        laps.append(elapsed)

        print(f"Lap {len(laps)}: {elapsed:.3f} seconds")

    elif command == "stop":

        if not running:
            print("Stopwatch is not running.")
            continue

        elapsed = time.time() - start_time
        running = False

        print(f"\nElapsed Time: {elapsed:.3f} seconds")

        again = input("\nContinue? (y/n): ").lower()

        if again != "y":
            print("Goodbye!")
            break

    elif command == "laps":

        if len(laps) == 0:
            print("No laps recorded.")

        else:
            print("\n========== Laps ==========")

            for i, lap in enumerate(laps, 1):
                print(f"Lap {i}: {lap:.3f} seconds")

    elif command == "reset":

        start_time = None
        running = False
        laps.clear()

        print("Stopwatch reset.")

    elif command == "exit":
        print("Goodbye!")
        break

    else:
        print("Unknown command. Type 'help'.")