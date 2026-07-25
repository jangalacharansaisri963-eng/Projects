import random

print("=== Dice Guessing Game ===")

wins = 0
losses = 0

while True:

    guess = int(input("\nGuess a number (1-6): "))

    if guess < 1 or guess > 6:
        print("Choose a number from 1 to 6.")
        continue

    input("Press Enter to roll the dice...")

    roll = random.randint(1, 6)

    print(f"\nDice rolled: {roll}")

    if guess == roll:
        wins += 1
        print("🎉 Correct!")
    else:
        losses += 1
        print("❌ Wrong!")

    print(f"\nWins: {wins}")
    print(f"Losses: {losses}")

    again = input("\nContinue? (y/n): ").lower()

    if again != "y":
        print("\nFinal Score")
        print(f"Wins: {wins}")
        print(f"Losses: {losses}")
        print("Goodbye!")
        break