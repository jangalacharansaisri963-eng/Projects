import random
import string


def generate_password(length, uppercase, lowercase, numbers, symbols):

    characters = ""

    if uppercase:
        characters += string.ascii_uppercase

    if lowercase:
        characters += string.ascii_lowercase

    if numbers:
        characters += string.digits

    if symbols:
        characters += "!@#$%^&*()-_=+[]{};:,.<>?/"

    if characters == "":
        return None

    password = ""

    for _ in range(length):
        password += random.choice(characters)

    return password


print("========== Password Generator ==========")

while True:

    try:
        length = int(input("\nPassword Length: "))

        if length < 4:
            print("Password should be at least 4 characters.")
            continue

        upper = input("Include Uppercase? (y/n): ").lower() == "y"
        lower = input("Include Lowercase? (y/n): ").lower() == "y"
        number = input("Include Numbers? (y/n): ").lower() == "y"
        symbol = input("Include Symbols? (y/n): ").lower() == "y"

        password = generate_password(
            length,
            upper,
            lower,
            number,
            symbol
        )

        if password is None:
            print("\nYou must select at least one character type.")
            continue

        print("\n========== Generated Password ==========")
        print(password)
        print("=" * 40)

        again = input("\nGenerate another? (y/n): ").lower()

        if again != "y":
            print("\nThanks for using Password Generator!")
            break

    except ValueError:
        print("Please enter a valid number.")