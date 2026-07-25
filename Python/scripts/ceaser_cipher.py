print("========== Caesar Cipher ==========")


def encrypt(text, shift):

    result = ""

    for char in text:

        if char.isalpha():

            start = ord('A') if char.isupper() else ord('a')

            result += chr((ord(char) - start + shift) % 26 + start)

        else:
            result += char

    return result


def decrypt(text, shift):

    return encrypt(text, -shift)


while True:

    print("""
1. Encrypt
2. Decrypt
3. Exit
""")

    choice = input("Choose option: ")

    if choice == "1":

        text = input("\nEnter text: ")

        try:
            shift = int(input("Shift (1-25): "))

            if shift < 1 or shift > 25:
                print("Shift must be between 1 and 25.")
                continue

            print("\nEncrypted Text:")
            print(encrypt(text, shift))

        except ValueError:
            print("Invalid shift.")
            continue


    elif choice == "2":

        text = input("\nEnter encrypted text: ")

        try:
            shift = int(input("Shift used (1-25): "))

            if shift < 1 or shift > 25:
                print("Shift must be between 1 and 25.")
                continue

            print("\nDecrypted Text:")
            print(decrypt(text, shift))

        except ValueError:
            print("Invalid shift.")
            continue


    elif choice == "3":
        print("Goodbye!")
        break

    else:
        print("Invalid option.")
        continue

    again = input("\nContinue? (y/n): ").lower()

    if again != "y":
        print("Goodbye!")
        break