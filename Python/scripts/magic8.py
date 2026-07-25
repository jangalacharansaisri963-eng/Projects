import random

RESPONSES = [
    "Yes.",
    "No.",
    "Definitely.",
    "Absolutely!",
    "Without a doubt.",
    "Most likely.",
    "Very likely.",
    "Signs point to yes.",
    "Maybe.",
    "Ask again later.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Better not tell you now.",
    "Don't count on it.",
    "Very doubtful.",
    "My sources say no.",
    "Outlook good.",
    "Outlook not so good.",
    "It is certain.",
    "It is decidedly so."
]


def about():
    print("""
========== About ==========
Magic 8 Ball v1.0

Ask any Yes/No question.
The Magic 8 Ball will reveal your answer!

Commands:
help
about
exit
===========================
""")


def help_menu():
    print("""
========== Help ==========

Ask any Yes/No question.

Examples:
Will I pass my exam?
Will it rain tomorrow?
Should I learn Python?

Commands:
help   - Show help
about  - About program
exit   - Quit immediately

==========================
""")


print("========== Magic 8 Ball ==========")
print("Type 'help' for commands.")

while True:

    question = input("\nAsk a question: ").strip()

    command = question.lower()

    if command == "help":
        help_menu()
        continue

    if command == "about":
        about()
        continue

    if command == "exit":
        print("Goodbye!")
        break

    if question == "":
        print("Please ask a question.")
        continue

    input("\nPress Enter to shake the Magic 8 Ball...")

    print("\n🎱 The Magic 8 Ball says...\n")
    print(random.choice(RESPONSES))

    again = input("\nContinue? (y/n): ").lower()

    if again != "y":
        print("\nThanks for playing!")
        break