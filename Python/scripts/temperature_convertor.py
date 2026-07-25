print("========== Temperature Converter ==========")


def celsius_to_fahrenheit(c):
    return (c * 9 / 5) + 32


def celsius_to_kelvin(c):
    return c + 273.15


def celsius_to_reaumur(c):
    return c * 4 / 5


def fahrenheit_to_celsius(f):
    return (f - 32) * 5 / 9


def fahrenheit_to_kelvin(f):
    return (f - 32) * 5 / 9 + 273.15


def fahrenheit_to_reaumur(f):
    return (f - 32) * 4 / 9


def kelvin_to_celsius(k):
    return k - 273.15


def kelvin_to_fahrenheit(k):
    return (k - 273.15) * 9 / 5 + 32


def kelvin_to_reaumur(k):
    return (k - 273.15) * 4 / 5


def reaumur_to_celsius(r):
    return r * 5 / 4


def reaumur_to_fahrenheit(r):
    return (r * 9 / 4) + 32


def reaumur_to_kelvin(r):
    return (r * 5 / 4) + 273.15


while True:

    print("""
1. Celsius
2. Fahrenheit
3. Kelvin
4. Réaumur
5. Exit
""")

    choice = input("Convert from: ")

    if choice == "5":
        print("Goodbye!")
        break

    try:
        value = float(input("Temperature: "))

        print("\n========== Result ==========")

        if choice == "1":
            print(f"Celsius: {value:.2f} °C")
            print(f"Fahrenheit: {celsius_to_fahrenheit(value):.2f} °F")
            print(f"Kelvin: {celsius_to_kelvin(value):.2f} K")
            print(f"Réaumur: {celsius_to_reaumur(value):.2f} °Ré")

        elif choice == "2":
            print(f"Fahrenheit: {value:.2f} °F")
            print(f"Celsius: {fahrenheit_to_celsius(value):.2f} °C")
            print(f"Kelvin: {fahrenheit_to_kelvin(value):.2f} K")
            print(f"Réaumur: {fahrenheit_to_reaumur(value):.2f} °Ré")

        elif choice == "3":
            print(f"Kelvin: {value:.2f} K")
            print(f"Celsius: {kelvin_to_celsius(value):.2f} °C")
            print(f"Fahrenheit: {kelvin_to_fahrenheit(value):.2f} °F")
            print(f"Réaumur: {kelvin_to_reaumur(value):.2f} °Ré")

        elif choice == "4":
            print(f"Réaumur: {value:.2f} °Ré")
            print(f"Celsius: {reaumur_to_celsius(value):.2f} °C")
            print(f"Fahrenheit: {reaumur_to_fahrenheit(value):.2f} °F")
            print(f"Kelvin: {reaumur_to_kelvin(value):.2f} K")

        else:
            print("Invalid option.")
            continue

        print("============================")

        again = input("\nContinue? (y/n): ").lower()

        if again != "y":
            print("Goodbye!")
            break

    except ValueError:
        print("Please enter a valid number.")