print("=== Palindrome Checker ===")

while True:
    text = input("Enter text: ")

    cleaned = text.lower().replace(" ", "")

    if cleaned == cleaned[::-1]:
        print("Palindrome")
    else:
        print("Not a palindrome")

    again = input("\nContinue? (y/n): ").lower()

    if again != "y":
        print("Goodbye!")
        break