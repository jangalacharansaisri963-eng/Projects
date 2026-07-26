def reverse_string(text):
    return text[::-1]


def main():
    print("=" * 45)
    print("         REVERSE STRING")
    print("=" * 45)

    while True:
        text = input("\nEnter text: ")

        if not text:
            print("Input cannot be empty!")
            continue

        reversed_text = reverse_string(text)

        print("\nOriginal :", text)
        print("Reversed :", reversed_text)

        while True:
            again = input("\nReverse another? (Y/N): ").strip().upper()

            if again == "Y":
                break
            elif again == "N":
                print("\nThank you for using Reverse String!")
                return
            else:
                print("Please enter Y or N.")


if __name__ == "__main__":
    main()