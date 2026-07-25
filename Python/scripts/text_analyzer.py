import string

print("========== Text Analyzer ==========")


def analyze(text):

    characters = len(text)
    characters_no_spaces = len(text.replace(" ", ""))
    words = len(text.split())
    sentences = sum(text.count(x) for x in ".!?")
    vowels = sum(1 for c in text.lower() if c in "aeiou")
    consonants = sum(1 for c in text.lower() if c.isalpha() and c not in "aeiou")
    digits = sum(1 for c in text if c.isdigit())
    spaces = text.count(" ")
    uppercase = sum(1 for c in text if c.isupper())
    lowercase = sum(1 for c in text if c.islower())
    punctuation = sum(1 for c in text if c in string.punctuation)

    longest = ""

    for word in text.split():

        clean = word.strip(string.punctuation)

        if len(clean) > len(longest):
            longest = clean

    print("\n========== Results ==========")
    print(f"Characters          : {characters}")
    print(f"Without Spaces      : {characters_no_spaces}")
    print(f"Words               : {words}")
    print(f"Sentences           : {sentences}")
    print(f"Vowels              : {vowels}")
    print(f"Consonants          : {consonants}")
    print(f"Digits              : {digits}")
    print(f"Spaces              : {spaces}")
    print(f"Uppercase Letters   : {uppercase}")
    print(f"Lowercase Letters   : {lowercase}")
    print(f"Punctuation Marks   : {punctuation}")

    if longest != "":
        print(f"Longest Word        : {longest}")

    if words > 0:
        print(f"Average Word Length : {characters_no_spaces / words:.2f}")

    print("=============================")


while True:

    print("""
1. Analyze Text
2. Help
3. About
4. Exit
""")

    choice = input("Choice: ")

    if choice == "1":

        text = input("\nEnter text:\n")

        analyze(text)

    elif choice == "2":

        print("""
Type or paste any text.

The analyzer counts:
- Characters
- Words
- Sentences
- Vowels
- Consonants
- Digits
- Spaces
- Uppercase
- Lowercase
- Punctuation
- Longest Word
- Average Word Length
""")

    elif choice == "3":

        print("""
========== About ==========
Text Analyzer
Version 1.0
Created in Python
===========================
""")

    elif choice == "4":

        print("Goodbye!")
        break

    else:

        print("Invalid choice.")
        continue

    again = input("\nContinue? (y/n): ").lower()

    if again != "y":
        print("Goodbye!")
        break