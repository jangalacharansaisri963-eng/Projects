import os
import json
import random
import sys

# Tic Tac Toe - Enhanced
# Features:
# - 1-player (vs Robot) with Easy/Normal/Hard difficulties
# - 2-player local
# - Win / Lose / Draw detection
# - Persistent statistics saved in tic_tac_toe_stats.json next to this file
# - Clean terminal board redraw

STATS_FILE = os.path.join(os.path.dirname(__file__), "tic_tac_toe_stats.json")

stats = {
    "matches_played": 0,
    "player_wins": 0,
    "robot_wins": 0,
    "draws": 0
}


def load_stats():
    global stats
    try:
        if os.path.exists(STATS_FILE):
            with open(STATS_FILE, "r") as f:
                data = json.load(f)
                stats.update(data)
    except Exception:
        # If reading fails, continue with defaults
        pass


def save_stats():
    try:
        with open(STATS_FILE, "w") as f:
            json.dump(stats, f, indent=2)
    except Exception:
        pass


def clear():
    os.system("cls" if os.name == "nt" else "clear")


def draw_board(board):
    clear()
    print()
    print(f" {board[0]} | {board[1]} | {board[2]} ")
    print("---+---+---")
    print(f" {board[3]} | {board[4]} | {board[5]} ")
    print("---+---+---")
    print(f" {board[6]} | {board[7]} | {board[8]} \n")


def check_winner(board):
    wins = (
        (0, 1, 2), (3, 4, 5), (6, 7, 8),
        (0, 3, 6), (1, 4, 7), (2, 5, 8),
        (0, 4, 8), (2, 4, 6)
    )
    for a, b, c in wins:
        if board[a] == board[b] == board[c] and board[a] in ("X", "O"):
            return board[a]
    if all(isinstance(x, str) and x in ("X", "O") for x in board):
        return "Draw"
    return None


def input_spot(player, board):
    while True:
        try:
            choice = input(f"Player {player}, choose a spot (1-9) or 'q' to quit: ").strip().lower()
            if choice == "q":
                confirm = input("Quit current match? (y/n): ").strip().lower()
                if confirm == "y":
                    return "quit"
                else:
                    continue
            pos = int(choice) - 1
            if pos < 0 or pos > 8:
                print("Please enter a number between 1 and 9.")
                continue
            if board[pos] in ("X", "O"):
                print("Spot already taken, choose another.")
                continue
            return pos
        except ValueError:
            print("Invalid input. Enter a number 1-9.")


# Robot move implementations


def robot_move_easy(board):
    choices = [i for i, v in enumerate(board) if v not in ("X", "O")]
    return random.choice(choices)


def find_winning_move(board, symbol):
    for i, v in enumerate(board):
        if v not in ("X", "O"):
            board_copy = board.copy()
            board_copy[i] = symbol
            if check_winner(board_copy) == symbol:
                return i
    return None


def robot_move_normal(board, robot_sym, player_sym):
    # Try to win
    win = find_winning_move(board, robot_sym)
    if win is not None:
        return win
    # Block player
    block = find_winning_move(board, player_sym)
    if block is not None:
        return block
    # Otherwise random
    return robot_move_easy(board)


# Minimax for hard difficulty


def minimax(board, depth, is_maximizing, robot_sym, player_sym):
    winner = check_winner(board)
    if winner == robot_sym:
        return 10 - depth
    elif winner == player_sym:
        return depth - 10
    elif winner == "Draw":
        return 0

    if is_maximizing:
        best = -999
        for i, v in enumerate(board):
            if v not in ("X", "O"):
                board[i] = robot_sym
                score = minimax(board, depth + 1, False, robot_sym, player_sym)
                board[i] = str(i + 1)
                best = max(best, score)
        return best
    else:
        best = 999
        for i, v in enumerate(board):
            if v not in ("X", "O"):
                board[i] = player_sym
                score = minimax(board, depth + 1, True, robot_sym, player_sym)
                board[i] = str(i + 1)
                best = min(best, score)
        return best


def robot_move_hard(board, robot_sym, player_sym):
    best_score = -999
    best_move = None
    for i, v in enumerate(board):
        if v not in ("X", "O"):
            board[i] = robot_sym
            score = minimax(board, 0, False, robot_sym, player_sym)
            board[i] = str(i + 1)
            if score > best_score:
                best_score = score
                best_move = i
    # Fallback
    if best_move is None:
        return robot_move_easy(board)
    return best_move


def robot_move(board, difficulty, robot_sym, player_sym):
    if difficulty == "easy":
        return robot_move_easy(board)
    elif difficulty == "normal":
        return robot_move_normal(board, robot_sym, player_sym)
    else:
        return robot_move_hard(board, robot_sym, player_sym)


def play_vs_robot(difficulty):
    board = [str(i) for i in range(1, 10)]

    # Choose symbol
    while True:
        sym = input("Choose your symbol (X/O). X goes first: ").strip().upper()
        if sym in ("X", "O"):
            player_sym = sym
            robot_sym = "O" if player_sym == "X" else "X"
            break
        print("Please choose X or O.")

    current = "X"  # X always goes first

    while True:
        draw_board(board)
        winner = check_winner(board)
        if winner:
            return winner, board, player_sym, robot_sym

        if current == player_sym:
            pos = input_spot(player_sym, board)
            if pos == "quit":
                return "Quit", board, player_sym, robot_sym
            board[pos] = player_sym
        else:
            print(f"Robot ({difficulty}) is thinking...")
            move = robot_move(board, difficulty, robot_sym, player_sym)
            board[move] = robot_sym

        current = "O" if current == "X" else "X"


def play_two_player():
    board = [str(i) for i in range(1, 10)]
    current = "X"

    while True:
        draw_board(board)
        winner = check_winner(board)
        if winner:
            return winner, board

        pos = input_spot(current, board)
        if pos == "quit":
            return "Quit", board
        board[pos] = current
        current = "O" if current == "X" else "X"


def show_stats():
    print("\n========== STATISTICS ==========")
    print(f"Matches Played : {stats['matches_played']}")
    print(f"Player Wins    : {stats['player_wins']}")
    print(f"Robot Wins     : {stats['robot_wins']}")
    print(f"Draws          : {stats['draws']}")
    print("================================\n")


def update_stats(result, mode, player_sym=None, robot_sym=None):
    # result is 'X' or 'O' or 'Draw' or 'Quit'
    # mode: 'vs_robot' or '2_player'
    if result == "Quit":
        return
    stats['matches_played'] += 1
    if result == 'Draw':
        stats['draws'] += 1
    else:
        if mode == 'vs_robot':
            # If winner symbol equals player_sym then human won
            if player_sym and result == player_sym:
                stats['player_wins'] += 1
            else:
                stats['robot_wins'] += 1
        else:
            # 2 player: treat it as a human win
            stats['player_wins'] += 1
    save_stats()


def main_menu():
    load_stats()
    while True:
        print("\n=== Tic Tac Toe ===")
        print("1) Play vs Robot")
        print("2) Two Player (local)")
        print("3) Show Statistics")
        print("4) Reset Statistics")
        print("5) Quit")

        choice = input("Choose an option (1-5): ").strip()
        if choice == '1':
            while True:
                d = input("Select difficulty - Easy/Normal/Hard (e/n/h): ").strip().lower()
                if d in ('e', 'n', 'h'):
                    diff = {'e': 'easy', 'n': 'normal', 'h': 'hard'}[d]
                    break
                print("Enter e, n, or h.")
            # Play vs robot - allow continuing matches in the same mode/difficulty
            while True:
                winner, board, player_sym, robot_sym = play_vs_robot(diff)
                if winner == 'Quit':
                    print("Match aborted.")
                else:
                    draw_board(board)
                    if winner == 'Draw':
                        print("It's a draw!")
                        update_stats('Draw', 'vs_robot')
                    else:
                        if winner == player_sym:
                            print("You win! Congratulations!")
                            update_stats(winner, 'vs_robot', player_sym, robot_sym)
                        else:
                            print("Robot wins! Better luck next time.")
                            update_stats(winner, 'vs_robot', player_sym, robot_sym)
                again = input("\nPlay again in vs Robot mode? (y/n): ").strip().lower()
                if again != 'y':
                    break

        elif choice == '2':
            # Two-player mode with continue option
            while True:
                winner, board = play_two_player()
                if winner == 'Quit':
                    print("Match aborted.")
                else:
                    draw_board(board)
                    if winner == 'Draw':
                        print("It's a draw!")
                        update_stats('Draw', '2_player')
                    else:
                        print(f"Player {winner} wins!")
                        update_stats(winner, '2_player')
                again = input("\nPlay again in Two Player mode? (y/n): ").strip().lower()
                if again != 'y':
                    break

        elif choice == '3':
            show_stats()

        elif choice == '4':
            confirm = input("Reset statistics? This cannot be undone (y/n): ").strip().lower()
            if confirm == 'y':
                stats.update({
                    "matches_played": 0,
                    "player_wins": 0,
                    "robot_wins": 0,
                    "draws": 0
                })
                save_stats()
                print("Statistics reset.")

        elif choice == '5':
            print("Goodbye!")
            return

        else:
            print("Enter a valid option 1-5.")


if __name__ == "__main__":
    try:
        main_menu()
    except KeyboardInterrupt:
        print("\nExiting...")
        sys.exit(0)
