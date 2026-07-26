def count_characters(text):
    frequency = {}

    for char in text:
        frequency[char] = frequency.get(char, 0) + 1

    return frequency


def display_character(char):
    if char == " ":
        return "[Space]"
    elif char == "\t":
        return "[Tab]"
    elif char == "\n":
        return "[New Line]"
    else:
        return repr(char)


def main():
    print("=" * 50)
    print("        CHARACTER FREQUENCY COUNTER")
    print("=" * 50)

    while True:
        text = input("\nEnter text: ")

        if not text:
            print("Input cannot be empty!")
            continue

        frequency = count_characters(text)

        print("\nCharacter Frequencies")
        print("-" * 50)

        for char, count in sorted(frequency.items()):
            print(f"{display_character(char):<15} : {count}")

        print("-" * 50)
        print(f"Total Characters  : {len(text)}")
        print(f"Unique Characters : {len(frequency)}")

        while True:
            again = input("\nCount another? (Y/N): ").strip().upper()

            if again == "Y":
                break
            elif again == "N":
                print("\nThank you for using Character Frequency Counter!")
                return
            else:
                print("Please enter Y or N.")


if __name__ == "__main__":
    main()