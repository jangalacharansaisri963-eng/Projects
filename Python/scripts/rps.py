import random

CHOICES = ["rock", "paper", "scissors"]

wins = 0
losses = 0
draws = 0


def help_menu():
    print("""
========== Help ==========

Type one of:

rock
paper
scissors

Commands:

help
about
score
exit

==========================
""")


def about():
    print("""
========== About ==========

Rock Paper Scissors
Version 1.0

Play against the computer.

==========================
""")


print("========== Rock Paper Scissors ==========")
print("Type 'help' for commands.")

while True:

    player = input("\nYour choice: ").lower().strip()

    if player == "help":
        help_menu()
        continue

    if player == "about":
        about()
        continue

    if player == "score":
        print(f"""
Wins   : {wins}
Losses : {losses}
Draws  : {draws}
""")
        continue

    if player == "exit":
        print("Goodbye!")
        break

    if player not in CHOICES:
        print("Choose rock, paper or scissors.")
        continue

    input("Press Enter to play...")

    computer = random.choice(CHOICES)

    print(f"\nComputer chose: {computer}")

    if player == computer:
        draws += 1
        print("\nIt's a draw!")

    elif (
        (player == "rock" and computer == "scissors") or
        (player == "paper" and computer == "rock") or
        (player == "scissors" and computer == "paper")
    ):
        wins += 1
        print("\n🎉 You win!")

    else:
        losses += 1
        print("\n❌ You lose!")

    print(f"""
========== Score ==========
Wins   : {wins}
Losses : {losses}
Draws  : {draws}
===========================
""")

    again = input("Continue? (y/n): ").lower()

    if again != "y":
        print("\nFinal Score")
        print(f"Wins   : {wins}")
        print(f"Losses : {losses}")
        print(f"Draws  : {draws}")
        print("\nThanks for playing!")
        break