import os

def draw_board(board):
    # Clears the terminal screen for a smooth, non-flickering update
    os.system('cls' if os.name == 'nt' else 'clear')
    print(f" {board[0]} | {board[1]} | {board[2]} ")
    print("---|---|---")
    print(f" {board[3]} | {board[4]} | {board[5]} ")
    print("---|---|---")
    print(f" {board[6]} | {board[7]} | {board[8]} \n")

def play_game():
    board = [str(i) for i in range(1, 10)]
    current_player = "X"
    
    for turn in range(9):
        draw_board(board)
        try:
            choice = int(input(f"Player {current_player}, choose a spot (1-9): ")) - 1
            if board[choice] in ["X", "O"]:
                print("Spot taken! Try again.")
                continue
            board[choice] = current_player
        except (ValueError, IndexError):
            print("Invalid input! Try again.")
            continue
            
        # (Add your win-checking logic here)
        
        current_player = "O" if current_player == "X" else "X"
    
    draw_board(board)
    print("Game Over!")

if __name__ == "__main__":
    play_game()
  
