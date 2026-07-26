def count_words(text):
    words = text.split()
    word_count = len(words)
    character_count = len(text)
    character_no_spaces = len(text.replace(" ", ""))
    sentence_count = sum(text.count(mark) for mark in ".!?")

    return (
        word_count,
        character_count,
        character_no_spaces,
        sentence_count
    )


def main():
    print("=" * 45)
    print("             WORD COUNTER")
    print("=" * 45)

    while True:
        text = input("\nEnter text: ").strip()

        if not text:
            print("Input cannot be empty!")
            continue

        words, chars, chars_no_spaces, sentences = count_words(text)

        print("\nResults")
        print("-" * 45)
        print(f"Words                 : {words}")
        print(f"Characters            : {chars}")
        print(f"Characters (No Space) : {chars_no_spaces}")
        print(f"Sentences             : {sentences}")

        while True:
            again = input("\nCount another? (Y/N): ").strip().upper()

            if again == "Y":
                break
            elif again == "N":
                print("\nThank you for using Word Counter!")
                return
            else:
                print("Please enter Y or N.")


if __name__ == "__main__":
    main()