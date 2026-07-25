import base64


def text_to_binary(text):
    return " ".join(format(b, "08b") for b in text.encode())


def binary_to_text(binary):
    data = bytes(int(x, 2) for x in binary.split())
    return data.decode()


def text_to_hex(text):
    return " ".join(format(b, "02X") for b in text.encode())


def hex_to_text(hex_data):
    data = bytes(int(x, 16) for x in hex_data.split())
    return data.decode()


def text_to_octal(text):
    return " ".join(format(b, "03o") for b in text.encode())


def octal_to_text(octal):
    data = bytes(int(x, 8) for x in octal.split())
    return data.decode()


def decimal_to_binary(number):
    return bin(number)[2:]


def decimal_to_hex(number):
    return hex(number)[2:].upper()


def decimal_to_octal(number):
    return oct(number)[2:]


def binary_to_decimal(binary):
    return int(binary, 2)


def hex_to_decimal(hex_number):
    return int(hex_number, 16)


def octal_to_decimal(octal):
    return int(octal, 8)


def decimal_to_all(number):

    print("\nBinary :", decimal_to_binary(number))
    print("Octal  :", decimal_to_octal(number))
    print("Hex    :", decimal_to_hex(number))


def help_menu():

    print("""
========== HELP ==========

Text Encoding:

1. Text → Binary
2. Binary → Text
3. Text → Hex
4. Hex → Text
5. Text → Octal
6. Octal → Text

Number Conversion:

7. Decimal → Binary
8. Decimal → Hex
9. Decimal → Octal
10. Binary → Decimal
11. Hex → Decimal
12. Octal → Decimal
13. Decimal → All

Other:

14. Base64 Encode
15. Base64 Decode

16. About
17. Exit

==========================
""")


def about():

    print("""
========== ABOUT ==========

NumberTranslatorTerminal

Version 1.0

Supports:
Binary
Hexadecimal
Octal
Decimal
Base64

==========================
""")


while True:

    print("""
========== Number Translator ==========

Type 'help' for commands.
""")

    choice = input("Choice: ").lower()


    if choice == "help":

        help_menu()


    elif choice == "1":

        text = input("Text: ")
        print(text_to_binary(text))


    elif choice == "2":

        binary = input("Binary: ")
        print(binary_to_text(binary))


    elif choice == "3":

        text = input("Text: ")
        print(text_to_hex(text))


    elif choice == "4":

        data = input("Hex: ")
        print(hex_to_text(data))


    elif choice == "5":

        text = input("Text: ")
        print(text_to_octal(text))


    elif choice == "6":

        data = input("Octal: ")
        print(octal_to_text(data))


    elif choice == "7":

        n = int(input("Decimal: "))
        print(decimal_to_binary(n))


    elif choice == "8":

        n = int(input("Decimal: "))
        print(decimal_to_hex(n))


    elif choice == "9":

        n = int(input("Decimal: "))
        print(decimal_to_octal(n))


    elif choice == "10":

        b = input("Binary: ")
        print(binary_to_decimal(b))


    elif choice == "11":

        h = input("Hex: ")
        print(hex_to_decimal(h))


    elif choice == "12":

        o = input("Octal: ")
        print(octal_to_decimal(o))


    elif choice == "13":

        n = int(input("Decimal: "))
        decimal_to_all(n)


    elif choice == "14":

        text = input("Text: ")
        encoded = base64.b64encode(text.encode()).decode()
        print(encoded)


    elif choice == "15":

        data = input("Base64: ")
        decoded = base64.b64decode(data).decode()
        print(decoded)


    elif choice == "16":

        about()


    elif choice == "17" or choice == "exit":

        print("Goodbye!")
        break


    else:

        print("Invalid command.")


    again = input("\nContinue? (y/n): ").lower()

    if again != "y":
        print("Goodbye!")
        break
