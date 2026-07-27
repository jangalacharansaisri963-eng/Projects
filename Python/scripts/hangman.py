"""
Hangman Game
Guess the word letter by letter before running out of attempts.
"""

import random

HANGMAN_STAGES = [
    """
       ------
       |    |
       |
       |
       |
       |
    --------
    """,
    """
       ------
       |    |
       |    O
       |
       |
       |
    --------
    """,
    """
       ------
       |    |
       |    O
       |    |
       |
       |
    --------
    """,
    """
       ------
       |    |
       |    O
       |   \\|
       |
       |
    --------
    """,
    """
       ------
       |    |
       |    O
       |   \\|/
       |
       |
    --------
    """,
    """
       ------
       |    |
       |    O
       |   \\|/
       |    |
       |
    --------
    """,
    """
       ------
       |    |
       |    O
       |   \\|/
       |    |
       |   / \\
    --------
    """
]

def get_word():
    """Get a random word from a predefined list."""
    word_list = ['python', 'hangman', 'computer', 'programming', 'developer',
                 'algorithm', 'function', 'variable', 'database', 'internet',
                 'keyboard', 'monitor', 'software', 'hardware', 'network']
    return random.choice(word_list).upper()

def display_hangman(attempts):
    """Display the current hangman stage."""
    print(HANGMAN_STAGES[len(HANGMAN_STAGES) - attempts - 1])

def display_word(word, guessed_letters):
    """Display the word with guessed letters revealed."""
    display = ''
    for letter in word:
        if letter in guessed_letters:
            display += letter + ' '
        else:
            display += '_ '
    return display

def play_game():
    """Main hangman game function."""
    word = get_word()
    guessed_letters = set()
    correct_guesses = set()
    attempts = 6
    
    print("=" * 50)
    print("🎮 Welcome to Hangman!")
    print("=" * 50)
    print("Guess the word letter by letter.")
    print(f"The word has {len(word)} letters.\n")
    
    while attempts > 0:
        display_hangman(attempts)
        print("\n" + display_word(word, correct_guesses))
        print(f"Guessed letters: {', '.join(sorted(guessed_letters))}")
        print(f"Attempts left: {attempts}\n")
        
        guess = input("Guess a letter: ").upper()
        
        if len(guess) != 1 or not guess.isalpha():
            print("❌ Please enter a single letter!\n")
            continue
        
        if guess in guessed_letters:
            print("❌ You already guessed that letter!\n")
            continue
        
        guessed_letters.add(guess)
        
        if guess in word:
            correct_guesses.add(guess)
            print(f"✅ Good guess! '{guess}' is in the word.\n")
            
            if all(letter in correct_guesses for letter in word):
                print("🎉 Congratulations! You won!")
                print(f"The word was: {word}")
                return True
        else:
            print(f"❌ Sorry, '{guess}' is not in the word.\n")
            attempts -= 1
    
    display_hangman(attempts)
    print(f"\n😢 Game Over! The word was: {word}")
    return False

def main():
    """Main function."""
    play_game()
    
    play_again = input("\nWould you like to play again? (yes/no): ").lower()
    if play_again in ['yes', 'y']:
        main()
    else:
        print("Thanks for playing! 👋")

if __name__ == "__main__":
    main()
