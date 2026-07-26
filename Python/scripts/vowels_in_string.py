def count_vowels(text):
    vowels = "aeiouAEIOU"
    count = 0

    for char in text:
        if char in vowels:
            count += 1

    return count


def main():
    print("=" * 45)
    print("         VOWEL COUNTER")
    print("=" * 45)

    while True:
        text = input("\nEnter text: ")

        if not text.strip():
            print("Input cannot be empty!")
            continue

        total = count_vowels(text)

        print("\nResults")
        print("-" * 45)
        print(f"Text         : {text}")
        print(f"Vowel Count  : {total}")

        while True:
            again = input("\nCount another? (Y/N): ").strip().upper()

            if again == "Y":
                break
            elif again == "N":
                print("\nThank you for using Vowel Counter!")
                return
            else:
                print("Please enter Y or N.")


if __name__ == "__main__":
    main()