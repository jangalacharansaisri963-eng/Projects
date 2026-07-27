"""
Memory Game
Match pairs of cards by remembering their positions.
"""

import random
import time
import os

def clear_screen():
    """Clear the console screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def display_board(board, revealed):
    """Display the game board."""
    print("\n" + "=" * 50)
    for i in range(len(board)):
        for j in range(len(board[i])):
            if revealed[i][j]:
                print(f"[{board[i][j]}]", end=" ")
            else:
                print(f"[?]", end=" ")
        print()
    print("=" * 50 + "\n")

def create_board(size=4):
    """Create a board with matching pairs."""
    pairs = size * size // 2
    symbols = ['🌟', '💎', '🎈', '🎉', '🎁', '🌺', '🌻', '🌸',
               '🍎', '🍌', '🍓', '🍒', '🎨', '🎭', '🎪', '🎯'][:pairs]
    board = symbols * 2
    random.shuffle(board)
    return [board[i*size:(i+1)*size] for i in range(size)]

def is_valid_position(row, col, size):
    """Validate if position is within board."""
    return 0 <= row < size and 0 <= col < size

def play_game(size=4):
    """Main memory game function."""
    board = create_board(size)
    revealed = [[False] * size for _ in range(size)]
    matched = [[False] * size for _ in range(size)]
    moves = 0
    pairs_found = 0
    total_pairs = size * size // 2
    
    print("=" * 50)
    print("🎮 Welcome to Memory Game!")
    print("=" * 50)
    print(f"Board size: {size}x{size}")
    print("Find all matching pairs!")
    print("Enter positions as: row,col (0-{} for each)".format(size-1))
    
    # Show all cards briefly
    display_board(board, [[True] * size for _ in range(size)])
    print("Memorize the positions...")
    time.sleep(3)
    
    clear_screen()
    
    while pairs_found < total_pairs:
        display_board(board, revealed)
        print(f"Pairs found: {pairs_found}/{total_pairs}")
        print(f"Moves: {moves}\n")
        
        # First card
        while True:
            try:
                pos1 = input("First card position (row,col): ").strip()
                row1, col1 = map(int, pos1.split(','))
                
                if not is_valid_position(row1, col1, size):
                    print(f"Invalid! Use 0-{size-1}.")
                    continue
                
                if matched[row1][col1]:
                    print("Already matched!")
                    continue
                
                break
            except:
                print(f"Invalid format! Use: row,col")
        
        revealed[row1][col1] = True
        display_board(board, revealed)
        
        # Second card
        while True:
            try:
                pos2 = input("Second card position (row,col): ").strip()
                row2, col2 = map(int, pos2.split(','))
                
                if not is_valid_position(row2, col2, size):
                    print(f"Invalid! Use 0-{size-1}.")
                    continue
                
                if (row2, col2) == (row1, col1):
                    print("Same card! Choose different position.")
                    continue
                
                if matched[row2][col2]:
                    print("Already matched!")
                    continue
                
                break
            except:
                print(f"Invalid format! Use: row,col")
        
        revealed[row2][col2] = True
        display_board(board, revealed)
        moves += 1
        
        # Check if cards match
        if board[row1][col1] == board[row2][col2]:
            print("✅ Match found!")
            matched[row1][col1] = True
            matched[row2][col2] = True
            pairs_found += 1
            time.sleep(1)
        else:
            print("❌ No match! Cards hidden again.")
            time.sleep(2)
            revealed[row1][col1] = False
            revealed[row2][col2] = False
        
        clear_screen()
    
    print("=" * 50)
    print("🎉 Congratulations! You won!")
    print(f"Total moves: {moves}")
    print(f"Pairs matched: {pairs_found}")
    print("=" * 50)

def main():
    """Main function."""
    print("=" * 50)
    print("Select Board Size:")
    print("1. Easy (2x2 - 2 pairs)")
    print("2. Medium (4x4 - 8 pairs)")
    print("3. Hard (6x6 - 18 pairs)")
    print("=" * 50)
    
    choice = input("\nEnter your choice (1/2/3): ").strip()
    size_map = {'1': 2, '2': 4, '3': 6}
    size = size_map.get(choice, 4)
    
    clear_screen()
    play_game(size)
    
    play_again = input("\nWould you like to play again? (yes/no): ").lower()
    if play_again in ['yes', 'y']:
        clear_screen()
        main()
    else:
        print("Thanks for playing! 👋")

if __name__ == "__main__":
    main()
