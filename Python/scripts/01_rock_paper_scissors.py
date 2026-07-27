"""
Rock, Paper, Scissors Game
A classic two-player game against the computer.
"""

import random

def get_choices():
    """Get player choice with validation."""
    player_choice = input("\nEnter your choice (rock/paper/scissors): ").lower()
    
    while player_choice not in ['rock', 'paper', 'scissors']:
        print("Invalid choice! Please enter rock, paper, or scissors.")
        player_choice = input("Enter your choice (rock/paper/scissors): ").lower()
    
    computer_choice = random.choice(['rock', 'paper', 'scissors'])
    return player_choice, computer_choice

def determine_winner(player, computer):
    """Determine the winner of the game."""
    if player == computer:
        return "It's a tie!"
    
    winning_combinations = {
        'rock': 'scissors',
        'paper': 'rock',
        'scissors': 'paper'
    }
    
    if winning_combinations[player] == computer:
        return "You win! 🎉"
    else:
        return "Computer wins! 🤖"

def play_game():
    """Main game loop."""
    print("=" * 40)
    print("Welcome to Rock, Paper, Scissors!")
    print("=" * 40)
    
    score = {'player': 0, 'computer': 0}
    
    while True:
        player_choice, computer_choice = get_choices()
        
        print(f"\nYou chose: {player_choice}")
        print(f"Computer chose: {computer_choice}")
        
        result = determine_winner(player_choice, computer_choice)
        print(f"\n{result}")
        
        if "You win" in result:
            score['player'] += 1
        elif "Computer wins" in result:
            score['computer'] += 1
        
        print(f"\nScore - You: {score['player']}, Computer: {score['computer']}")
        
        play_again = input("\nPlay again? (yes/no): ").lower()
        if play_again not in ['yes', 'y']:
            print("\nThanks for playing!")
            print(f"Final Score - You: {score['player']}, Computer: {score['computer']}")
            break

if __name__ == "__main__":
    play_game()
