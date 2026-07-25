import os

ROMAN_VALUES = {
    "I": 1,
    "V": 5,
    "X": 10,
    "L": 50,
    "C": 100,
    "D": 500,
    "M": 1000
}

ROMAN_PAIRS = [
    (1000, "M"),
    (900, "CM"),
    (500, "D"),
    (400, "CD"),
    (100, "C"),
    (90, "XC"),
    (50, "L"),
    (40, "XL"),
    (10, "X"),
    (9, "IX"),
    (5, "V"),
    (4, "IV"),
    (1, "I")
]


def clear():
    os.system("cls" if os.name == "nt" else "clear")


def banner():
    print("=" * 60)
    print("              ROMAN TERMINAL")
    print("      Professional Roman Numeral Utility")
    print("=" * 60)


def int_to_roman(number):
    if number < 1 or number > 3999:
        return None

    result = ""

    for value, symbol in ROMAN_PAIRS:
        while number >= value:
            result += symbol
            number -= value

    return result


def roman_to_int(roman):
    roman = roman.upper()

    total = 0
    previous = 0

    for ch in reversed(roman):
        if ch not in ROMAN_VALUES:
            return None

        value = ROMAN_VALUES[ch]

        if value < previous:
            total -= value
        else:
            total += value
            previous = value

    return total


def is_valid_roman(roman):
    value = roman_to_int(roman)

    if value is None:
        return False

    return int_to_roman(value) == roman.upper()


def integer_conversion():
    print("\nInteger ➜ Roman\n")

    try:
        number = int(input("Enter integer (1-3999): "))
    except ValueError:
        print("\nInvalid integer.")
        return

    roman = int_to_roman(number)

    if roman is None:
        print("\nNumber must be between 1 and 3999.")
    else:
        print(f"\nRoman Numeral : {roman}")


def roman_conversion():
    print("\nRoman ➜ Integer\n")

    roman = input("Enter Roman numeral: ").strip().upper()

    if not is_valid_roman(roman):
        print("\nInvalid Roman numeral.")
        return

    print(f"\nInteger : {roman_to_int(roman)}")


def validate():
    print("\nRoman Validation\n")

    roman = input("Enter Roman numeral: ").strip().upper()

    if is_valid_roman(roman):
        print("\nValid Roman numeral.")
    else:
        print("\nInvalid Roman numeral.")


def help_menu():
    print("""
================ HELP ================

1. Integer → Roman
   Converts numbers from 1–3999.

2. Roman → Integer
   Converts Roman numerals to integers.

3. Validate Roman
   Checks whether a Roman numeral is valid.

Roman Symbols
--------------
I = 1
V = 5
X = 10
L = 50
C = 100
D = 500
M = 1000

Examples
--------
49   -> XLIX
3999 -> MMMCMXCIX
MCMXCIV -> 1994

======================================
""")


def about():
    print("""
=============== ABOUT ===============

Roman Terminal
Version : 1.0

A professional command-line Roman
Numeral converter featuring:

• Integer → Roman
• Roman → Integer
• Roman Validator
• Help Menu
• Input Validation

Developed in Python.

=====================================
""")


def menu():
    print("""
1. Integer → Roman
2. Roman → Integer
3. Validate Roman
4. Help
5. About
6. Exit
""")


def ask_continue():
    while True:
        choice = input("\nContinue? (y/n): ").strip().lower()

        if choice == "y":
            return True

        if choice == "n":
            return False

        print("Please enter y or n.")


def main():
    while True:
        clear()
        banner()
        menu()

        choice = input("Select option: ").strip()

        if choice == "1":
            integer_conversion()

        elif choice == "2":
            roman_conversion()

        elif choice == "3":
            validate()

        elif choice == "4":
            help_menu()

        elif choice == "5":
            about()

        elif choice == "6":
            print("\nGoodbye!")
            break

        else:
            print("\nInvalid menu option.")

        if not ask_continue():
            print("\nGoodbye!")
            break


if __name__ == "__main__":
    main()
    
    # ============================================================
# RomanTerminal Part 1B
# Extra Utility Functions
# ============================================================

# Stores conversion history
history = []


def add_history(operation, original, result):
    """Adds an operation to history."""
    history.append({
        "operation": operation,
        "input": original,
        "result": result
    })


def show_history():
    """Displays previous conversions."""
    print("\n========== HISTORY ==========\n")

    if not history:
        print("No history available.")
        return

    for i, item in enumerate(history, start=1):
        print(
            f"{i}. "
            f"[{item['operation']}] "
            f"{item['input']}  ->  {item['result']}"
        )

    print("\n=============================")


def clear_history():
    """Clears conversion history."""
    history.clear()
    print("\nHistory cleared.")


def roman_info():
    """Displays Roman numeral rules."""

    print("""
==============================
      ROMAN NUMERAL RULES
==============================

Basic Symbols

I = 1
V = 5
X = 10
L = 50
C = 100
D = 500
M = 1000

Subtractive Rules

IV = 4
IX = 9
XL = 40
XC = 90
CD = 400
CM = 900

Rules

• I can precede V and X
• X can precede L and C
• C can precede D and M

• V, L and D never repeat.
• I, X, C and M repeat
  at most three times.

Examples

XIV = 14
XLII = 42
XCIX = 99
MCMXCIV = 1994

==============================
""")


def compare_romans():
    """Compare two Roman numerals."""

    print("\nCompare Roman Numerals\n")

    first = input("First Roman : ").upper().strip()
    second = input("Second Roman: ").upper().strip()

    if not is_valid_roman(first):
        print("\nFirst Roman numeral is invalid.")
        return

    if not is_valid_roman(second):
        print("\nSecond Roman numeral is invalid.")
        return

    a = roman_to_int(first)
    b = roman_to_int(second)

    print()

    if a > b:
        print(f"{first} ({a}) > {second} ({b})")

    elif a < b:
        print(f"{first} ({a}) < {second} ({b})")

    else:
        print(f"{first} = {second}")


def roman_statistics():
    """Displays simple statistics."""

    print("\n========= STATISTICS =========")

    print(f"Conversions performed : {len(history)}")

    integer_ops = sum(
        1 for item in history
        if item["operation"] == "Integer → Roman"
    )

    roman_ops = sum(
        1 for item in history
        if item["operation"] == "Roman → Integer"
    )

    validations = sum(
        1 for item in history
        if item["operation"] == "Validation"
    )

    print(f"Integer → Roman : {integer_ops}")
    print(f"Roman → Integer : {roman_ops}")
    print(f"Validations      : {validations}")

    print("===============================")


def credits():
    print("""
==============================
          CREDITS
==============================

RomanTerminal

Professional Roman Numeral
Command Line Utility

Written in Python

Features

✓ Integer ↔ Roman
✓ Validation
✓ History
✓ Statistics
✓ Comparison
✓ Help

==============================
""")


# ============================================================
# Add these options to your menu()
# ============================================================

"""
7. History
8. Clear History
9. Roman Rules
10. Compare Romans
11. Statistics
12. Credits
"""


# ============================================================
# Add these inside main()
# ============================================================

"""
elif choice == "7":
    show_history()

elif choice == "8":
    clear_history()

elif choice == "9":
    roman_info()

elif choice == "10":
    compare_romans()

elif choice == "11":
    roman_statistics()

elif choice == "12":
    credits()
"""


# ============================================================
# Also modify your existing functions
# ============================================================

# In integer_conversion(), after successful conversion:
#
# add_history(
#     "Integer → Roman",
#     number,
#     roman
# )

# In roman_conversion():
#
# add_history(
#     "Roman → Integer",
#     roman,
#     roman_to_int(roman)
# )

# In validate():
#
# add_history(
#     "Validation",
#     roman,
#     "Valid" if is_valid_roman(roman) else "Invalid"
# )

# ============================================================
# RomanTerminal Part 2A
# Advanced Features
# ============================================================

import random


# ------------------------------------------------------------
# Roman Calculator
# ------------------------------------------------------------

def roman_calculator():
    print("\n========== ROMAN CALCULATOR ==========\n")

    first = input("First Roman Numeral : ").strip().upper()

    if not is_valid_roman(first):
        print("\nInvalid first numeral.")
        return

    operator = input("Operator (+ - * /): ").strip()

    second = input("Second Roman Numeral: ").strip().upper()

    if not is_valid_roman(second):
        print("\nInvalid second numeral.")
        return

    a = roman_to_int(first)
    b = roman_to_int(second)

    try:

        if operator == "+":
            answer = a + b

        elif operator == "-":
            answer = a - b

        elif operator == "*":
            answer = a * b

        elif operator == "/":
            answer = a // b

        else:
            print("\nUnknown operator.")
            return

        if answer <= 0 or answer > 3999:
            print("\nResult cannot be represented in Roman numerals.")
            return

        print("\nDecimal :", answer)
        print("Roman   :", int_to_roman(answer))

    except ZeroDivisionError:
        print("\nDivision by zero is not allowed.")


# ------------------------------------------------------------
# Roman Table Generator
# ------------------------------------------------------------

def roman_table():

    try:
        limit = int(input("\nGenerate table up to: "))
    except ValueError:
        print("Invalid number.")
        return

    if limit < 1:
        return

    print("\nDecimal    Roman")
    print("-----------------------")

    for i in range(1, limit + 1):
        print(f"{i:<10}{int_to_roman(i)}")


# ------------------------------------------------------------
# Search Decimal
# ------------------------------------------------------------

def search_decimal():

    roman = input("\nRoman Numeral: ").upper().strip()

    if not is_valid_roman(roman):
        print("Invalid Roman numeral.")
        return

    print(f"\n{roman} = {roman_to_int(roman)}")


# ------------------------------------------------------------
# Search Roman
# ------------------------------------------------------------

def search_roman():

    try:
        value = int(input("\nDecimal Number: "))
    except ValueError:
        print("Invalid number.")
        return

    roman = int_to_roman(value)

    if roman is None:
        print("Number must be between 1 and 3999.")
    else:
        print(f"\n{value} = {roman}")


# ------------------------------------------------------------
# Random Roman Quiz
# ------------------------------------------------------------

def random_quiz():

    print("\n========== QUIZ ==========\n")

    score = 0

    for question in range(1, 6):

        value = random.randint(1, 100)

        answer = input(
            f"{question}. Roman numeral for {value}: "
        ).upper().strip()

        correct = int_to_roman(value)

        if answer == correct:
            print("Correct!\n")
            score += 1
        else:
            print(f"Wrong! Correct answer: {correct}\n")

    print(f"Final Score: {score}/5")


# ------------------------------------------------------------
# Random Roman Generator
# ------------------------------------------------------------

def random_generator():

    value = random.randint(1, 3999)

    print("\nRandom Number")
    print("----------------")

    print("Decimal :", value)
    print("Roman   :", int_to_roman(value))


# ------------------------------------------------------------
# Largest Roman
# ------------------------------------------------------------

def largest_roman():

    print("\nLargest Standard Roman Numeral")

    print("3999")
    print("MMMCMXCIX")


# ------------------------------------------------------------
# Menu Additions
# ------------------------------------------------------------

"""
13. Roman Calculator
14. Roman Table
15. Search Decimal
16. Search Roman
17. Random Quiz
18. Random Generator
19. Largest Roman Numeral
"""


# ------------------------------------------------------------
# Add inside main()
# ------------------------------------------------------------

"""
elif choice == "13":
    roman_calculator()

elif choice == "14":
    roman_table()

elif choice == "15":
    search_decimal()

elif choice == "16":
    search_roman()

elif choice == "17":
    random_quiz()

elif choice == "18":
    random_generator()

elif choice == "19":
    largest_roman()
"""

# ============================================================
# RomanTerminal Part 2B
# Professional Features
# ============================================================

import json
import csv
import time
from datetime import datetime

SESSION_START = time.time()

FAVORITES = []

SETTINGS = {
    "show_banner": True,
    "auto_save_history": False
}


# ============================================================
# Save History
# ============================================================

def save_history(filename="history.json"):
    with open(filename, "w", encoding="utf-8") as file:
        json.dump(history, file, indent=4)

    print("\nHistory saved successfully.")


# ============================================================
# Load History
# ============================================================

def load_history(filename="history.json"):
    global history

    try:
        with open(filename, "r", encoding="utf-8") as file:
            history = json.load(file)

        print("\nHistory loaded successfully.")

    except FileNotFoundError:
        print("\nNo history file found.")


# ============================================================
# Export CSV
# ============================================================

def export_csv(filename="history.csv"):

    with open(filename, "w", newline="", encoding="utf-8") as file:

        writer = csv.writer(file)

        writer.writerow(["Operation", "Input", "Result"])

        for item in history:
            writer.writerow([
                item["operation"],
                item["input"],
                item["result"]
            ])

    print("\nCSV exported successfully.")


# ============================================================
# Favorites
# ============================================================

def add_favorite():

    roman = input("\nRoman Numeral: ").upper().strip()

    if not is_valid_roman(roman):
        print("Invalid Roman numeral.")
        return

    FAVORITES.append(roman)

    print("Added to favorites.")


def show_favorites():

    print("\n========== FAVORITES ==========\n")

    if not FAVORITES:
        print("No favorites saved.")
        return

    for i, value in enumerate(FAVORITES, start=1):
        print(f"{i}. {value} = {roman_to_int(value)}")


# ============================================================
# Session Information
# ============================================================

def session_info():

    elapsed = int(time.time() - SESSION_START)

    print("\n========== SESSION ==========\n")

    print("Started :", datetime.now().strftime("%Y-%m-%d"))
    print("Runtime :", elapsed, "seconds")
    print("History :", len(history))
    print("Favorites :", len(FAVORITES))


# ============================================================
# Settings
# ============================================================

def settings_menu():

    while True:

        print("""
========== SETTINGS ==========

1. Toggle Banner
2. Toggle Auto Save
3. Show Settings
4. Back

==============================
""")

        choice = input("Choice: ")

        if choice == "1":
            SETTINGS["show_banner"] = not SETTINGS["show_banner"]

        elif choice == "2":
            SETTINGS["auto_save_history"] = \
                not SETTINGS["auto_save_history"]

        elif choice == "3":
            print()

            for key, value in SETTINGS.items():
                print(f"{key} : {value}")

        elif choice == "4":
            break

        else:
            print("Invalid choice.")


# ============================================================
# Auto Save Helper
# ============================================================

def auto_save():
    if SETTINGS["auto_save_history"]:
        save_history()


# ============================================================
# Call auto_save() after each history addition if enabled.
# ============================================================


# ============================================================
# Add these menu options
# ============================================================

"""
20. Save History
21. Load History
22. Export CSV
23. Favorites
24. Session Info
25. Settings
"""


# ============================================================
# Add inside main()
# ============================================================

"""
elif choice == "20":
    save_history()

elif choice == "21":
    load_history()

elif choice == "22":
    export_csv()

elif choice == "23":

    print()

    print("1. Add Favorite")
    print("2. Show Favorites")

    sub = input("Choice: ")

    if sub == "1":
        add_favorite()

    elif sub == "2":
        show_favorites()

elif choice == "24":
    session_info()

elif choice == "25":
    settings_menu()
"""

# ============================================================
# RomanTerminal Part 3
# Professional CLI Features
# ============================================================

import os

# ============================================================
# ANSI Colors
# ============================================================

RESET = "\033[0m"
RED = "\033[91m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
MAGENTA = "\033[95m"
CYAN = "\033[96m"
WHITE = "\033[97m"

CURRENT_THEME = CYAN


def color(text):
    return CURRENT_THEME + text + RESET


def change_theme():

    global CURRENT_THEME

    print("""
========== THEMES ==========
1. Cyan
2. Green
3. Blue
4. Yellow
5. Magenta
6. Red
============================
""")

    choice = input("Theme: ")

    themes = {
        "1": CYAN,
        "2": GREEN,
        "3": BLUE,
        "4": YELLOW,
        "5": MAGENTA,
        "6": RED
    }

    if choice in themes:
        CURRENT_THEME = themes[choice]
        print(color("Theme changed successfully."))
    else:
        print("Invalid choice.")


# ============================================================
# Command Mode
# ============================================================

def command_mode():

    print(color("\nType 'exit' to return.\n"))

    while True:

        command = input("Roman> ").strip()

        if command.lower() == "exit":
            break

        parts = command.split()

        if not parts:
            continue

        try:

            if parts[0] == "roman":

                number = int(parts[1])
                print(int_to_roman(number))

            elif parts[0] == "int":

                print(roman_to_int(parts[1].upper()))

            elif parts[0] == "validate":

                print(is_valid_roman(parts[1].upper()))

            elif parts[0] == "clear":

                os.system("cls" if os.name == "nt" else "clear")

            elif parts[0] == "help":

                print("""
roman 25
int XXV
validate XIV
clear
exit
""")

            else:
                print("Unknown command.")

        except Exception:
            print("Invalid command syntax.")


# ============================================================
# Achievements
# ============================================================

ACHIEVEMENTS = {
    "First Conversion": False,
    "10 Conversions": False,
    "50 Conversions": False,
    "100 Conversions": False
}


def check_achievements():

    count = len(history)

    if count >= 1:
        ACHIEVEMENTS["First Conversion"] = True

    if count >= 10:
        ACHIEVEMENTS["10 Conversions"] = True

    if count >= 50:
        ACHIEVEMENTS["50 Conversions"] = True

    if count >= 100:
        ACHIEVEMENTS["100 Conversions"] = True


def show_achievements():

    check_achievements()

    print("\n========== ACHIEVEMENTS ==========\n")

    for name, unlocked in ACHIEVEMENTS.items():

        if unlocked:
            print("[Unlocked]", name)
        else:
            print("[Locked ]", name)


# ============================================================
# Tutorial
# ============================================================

def tutorial():

    pages = [

"""
Lesson 1

Roman Symbols

I V X L C D M
""",

"""
Lesson 2

Subtractive Notation

IV IX XL XC CD CM
""",

"""
Lesson 3

Examples

49 = XLIX
99 = XCIX
2026 = MMXXVI
""",

"""
Lesson 4

Use the converter,
calculator,
quiz and history
to master Roman numerals.
"""
    ]

    for page in pages:

        print(page)
        input("Press Enter...")


# ============================================================
# Search History
# ============================================================

def search_history():

    keyword = input("\nSearch: ").lower()

    found = False

    for item in history:

        text = (
            str(item["input"]) +
            str(item["result"]) +
            item["operation"]
        ).lower()

        if keyword in text:

            print(item)
            found = True

    if not found:
        print("Nothing found.")


# ============================================================
# Clear Screen
# ============================================================

def clear_screen():
    os.system("cls" if os.name == "nt" else "clear")


# ============================================================
# Fancy Banner
# ============================================================

def fancy_banner():

    print(color("""
██████╗  ██████╗ ███╗   ███╗ █████╗ ███╗   ██╗
██╔══██╗██╔═══██╗████╗ ████║██╔══██╗████╗  ██║
██████╔╝██║   ██║██╔████╔██║███████║██╔██╗ ██║
██╔══██╗██║   ██║██║╚██╔╝██║██╔══██║██║╚██╗██║
██║  ██║╚██████╔╝██║ ╚═╝ ██║██║  ██║██║ ╚████║
╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝

         RomanTerminal Professional
"""))


# ============================================================
# Add to Main Menu
# ============================================================

"""
26. Change Theme
27. Command Mode
28. Achievements
29. Tutorial
30. Search History
31. Clear Screen
"""


# ============================================================
# Add to main()
# ============================================================

"""
elif choice == "26":
    change_theme()

elif choice == "27":
    command_mode()

elif choice == "28":
    show_achievements()

elif choice == "29":
    tutorial()

elif choice == "30":
    search_history()

elif choice == "31":
    clear_screen()
"""

# ============================================================
# RomanTerminal Part 4
# Final Professional Features
# ============================================================

import logging
import time
from datetime import datetime

# ============================================================
# Logging
# ============================================================

logging.basicConfig(
    filename="roman_terminal.log",
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

def log_event(message):
    logging.info(message)


# ============================================================
# Benchmark
# ============================================================

def benchmark():

    print("\nRunning benchmark...\n")

    start = time.perf_counter()

    for i in range(1, 4000):
        int_to_roman(i)

    end = time.perf_counter()

    print(f"3999 conversions completed in {end-start:.6f} seconds.")


# ============================================================
# Extended Roman (>3999)
# Uses (V)=5000, (X)=10000, etc.
# ============================================================

def extended_roman(number):

    if number <= 3999:
        return int_to_roman(number)

    result = ""

    thousands = number // 1000
    remainder = number % 1000

    if thousands <= 3:
        result += "M" * thousands
    else:
        result += f"({int_to_roman(thousands)})"

    result += int_to_roman(remainder)

    return result


# ============================================================
# Roman Clock
# ============================================================

def roman_clock():

    now = datetime.now()

    print("\n========== ROMAN CLOCK ==========\n")

    print("Hour   :", int_to_roman(now.hour if now.hour else 12))
    print("Minute :", int_to_roman(now.minute + 1))
    print("Second :", int_to_roman(now.second + 1))


# ============================================================
# System Information
# ============================================================

def system_information():

    print("""
========== SYSTEM ==========

RomanTerminal Professional

Language : Python
Version  : 4.0
Encoding : UTF-8

Features
--------

✓ Integer ↔ Roman
✓ Validation
✓ Calculator
✓ Quiz
✓ History
✓ Statistics
✓ Themes
✓ Favorites
✓ Save / Load
✓ Export CSV
✓ Command Mode
✓ Tutorial
✓ Achievements
✓ Benchmark
✓ Extended Numerals
✓ Roman Clock

============================
""")


# ============================================================
# Reset Everything
# ============================================================

def reset_terminal():

    global history
    global FAVORITES

    history.clear()
    FAVORITES.clear()

    print("\nApplication reset completed.")


# ============================================================
# Menu Search
# ============================================================

MENU_ITEMS = {
    "convert": 1,
    "history": 7,
    "calculator": 13,
    "quiz": 17,
    "settings": 25,
    "theme": 26,
    "command": 27,
    "tutorial": 29
}

def search_menu():

    keyword = input("\nSearch menu: ").lower()

    for name, number in MENU_ITEMS.items():

        if keyword in name:
            print(f"{number}. {name.title()}")


# ============================================================
# Startup Splash
# ============================================================

def splash():

    print("""
************************************************

        RomanTerminal Professional
               Version 4.0

************************************************
""")

    time.sleep(1)


# ============================================================
# Exit Screen
# ============================================================

def goodbye():

    print("""
====================================

Thank you for using

RomanTerminal Professional

Have a wonderful day!

====================================
""")


# ============================================================
# Final Menu Additions
# ============================================================

"""
32. Benchmark
33. Extended Roman Converter
34. Roman Clock
35. System Information
36. Reset Application
37. Search Menu
38. Exit
"""


# ============================================================
# Add inside main()
# ============================================================

"""
elif choice == "32":
    benchmark()

elif choice == "33":

    value = int(input("Number: "))
    print(extended_roman(value))

elif choice == "34":
    roman_clock()

elif choice == "35":
    system_information()

elif choice == "36":
    reset_terminal()

elif choice == "37":
    search_menu()

elif choice == "38":
    goodbye()
    break
"""