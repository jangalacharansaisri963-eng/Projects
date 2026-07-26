# ==========================================
# CURRENCY CONVERTER TERMINAL
# Version 1.0
# ==========================================


# Offline exchange rates (example rates)
rates = {
    "USD": 1.0,
    "INR": 83.0,
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 150.0
}


def convert_currency(amount, from_currency, to_currency):
    usd_amount = amount / rates[from_currency]
    converted = usd_amount * rates[to_currency]

    return converted


print("=" * 50)
print("        CURRENCY CONVERTER TERMINAL")
print("              Version 1.0")
print("=" * 50)


while True:

    print("\nAvailable Currencies:")
    print("USD - US Dollar")
    print("INR - Indian Rupee")
    print("EUR - Euro")
    print("GBP - British Pound")
    print("JPY - Japanese Yen")

    try:
        amount = float(input("\nEnter amount: "))

        from_currency = input("Convert from: ").upper()
        to_currency = input("Convert to: ").upper()

        if from_currency not in rates or to_currency not in rates:
            print("\nInvalid currency!")

        else:
            result = convert_currency(
                amount,
                from_currency,
                to_currency
            )

            print("\n========== RESULT ==========")
            print(f"{amount} {from_currency} = {result:.2f} {to_currency}")
            print("============================")

    except ValueError:
        print("\nInvalid amount!")

    choice = input("\nContinue? (y/n): ").lower()

    if choice != "y":
        print("\nThank you for using Currency Converter!")
        break