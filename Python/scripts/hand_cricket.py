import random

# ==========================================
# HAND CRICKET TERMINAL
# Version 2.0
# ==========================================

# -----------------------------
# GLOBAL STATISTICS
# -----------------------------

matches_played = 0
player_wins = 0
robot_wins = 0
draws = 0

highest_player_score = 0
highest_robot_score = 0


# -----------------------------
# TITLE
# -----------------------------

def show_title():

    print("=" * 45)
    print("         HAND CRICKET TERMINAL")
    print("=" * 45)


# -----------------------------
# PLAYER INPUT
# -----------------------------

def get_player_run():

    while True:

        text = input("Enter your run (1-10): ").strip().lower()

        # -------------------------
        # DEVELOPER COMMANDS
        # -------------------------

        if text == "log bowled":
            return "LOG_BOWLED"

        if text == "log 500":
            return "LOG_500"

        try:

            run = int(text)

            if 1 <= run <= 10:
                return run

            print("Please enter a number between 1 and 10.")

        except ValueError:

            print("Invalid input.")


# -----------------------------
# ROBOT
# -----------------------------

def robot_run():

    return random.randint(1, 10)


# -----------------------------
# COIN TOSS
# -----------------------------

def toss():

    print("\n========== COIN TOSS ==========")

    while True:

        choice = input("Choose Heads or Tails (h/t): ").strip().lower()

        if choice in ("h", "t"):
            break

        print("Please enter h or t.")

    coin = random.choice(("h", "t"))

    print()

    if coin == "h":
        print("🪙 Coin landed on HEADS.")
    else:
        print("🪙 Coin landed on TAILS.")

    # -------------------------
    # PLAYER WINS TOSS
    # -------------------------

    if choice == coin:

        print("\n🎉 You won the toss!")

        while True:

            option = input("Choose Bat or Bowl (bat/bowl): ").strip().lower()

            if option == "bat":

                print("\n🏏 You chose to BAT first.")
                return "bat"

            elif option == "bowl":

                print("\n🎯 You chose to BOWL first.")
                return "bowl"

            else:

                print("Please type bat or bowl.")

    # -------------------------
    # ROBOT WINS TOSS
    # -------------------------

    print("\n🤖 Robot won the toss!")

    option = random.choice(("bat", "bowl"))

    if option == "bat":

        print("🤖 Robot chose to BAT first.")
        print("🎯 You will bowl first.")

        return "bowl"

    else:

        print("🤖 Robot chose to BOWL first.")
        print("🏏 You will bat first.")

        return "bat"
        
# ==========================================
# PART 2 - FIRST INNINGS
# ==========================================

# -----------------------------
# PLAYER BATTING
# -----------------------------

def player_bats():

    print("\n========== FIRST INNINGS ==========")
    print("🏏 You are batting first.\n")

    score = 0

    while True:

        player = get_player_run()

        # Developer Command
        if player == "LOG_500":

            score = 500

            print("\n📝 Developer Command: log 500")
            print("Your score has been set to 500.")
            print(f"Your Final Score: {score}")

            return score

        robot = robot_run()

        print(f"🤖 Robot Played : {robot}")

        if player == robot:

            print("\n❌ YOU ARE OUT!")
            print(f"Final Score : {score}")

            return score

        score += player

        print(f"You Scored : {player}")
        print(f"Total Score: {score}\n")


# -----------------------------
# PLAYER BOWLING
# -----------------------------

def player_bowls():

    print("\n========== FIRST INNINGS ==========")
    print("🎯 You are bowling first.\n")

    score = 0

    while True:

        player = get_player_run()

        # Developer Command
        if player == "LOG_BOWLED":

            robot = robot_run()

            print(f"🤖 Robot Played : {robot}")
            print("\n📝 Developer Command: log bowled")
            print("❌ ROBOT OUT!")
            print(f"Robot Final Score : {score}")

            return score

        robot = robot_run()

        print(f"🤖 Robot Played : {robot}")

        if player == robot:

            print("\n❌ ROBOT OUT!")
            print(f"Robot Final Score : {score}")

            return score

        score += robot

        print(f"Robot Scored : {robot}")
        print(f"Robot Total  : {score}\n")


# -----------------------------
# FIRST INNINGS CONTROLLER
# -----------------------------

def first_innings(choice):

    if choice == "bat":

        player_score = player_bats()
        robot_score = None

    else:

        robot_score = player_bowls()
        player_score = None

    target = (player_score if player_score is not None else robot_score) + 1

    print("\n==============================")
    print(f"🎯 Target : {target}")
    print("==============================")

    return player_score, robot_score, target
    
# ==========================================
# PART 3 - SECOND INNINGS
# ==========================================

# -----------------------------
# PLAYER CHASES
# -----------------------------

def chase_by_player(target):

    print("\n========== SECOND INNINGS ==========")
    print(f"🏏 You need {target} runs to win.\n")

    score = 0

    while True:

        player = get_player_run()

        # Developer Command
        if player == "LOG_500":

            score = 500

            print("\n📝 Developer Command: log 500")
            print(f"Your Final Score : {score}")

            return score

        robot = robot_run()

        print(f"🤖 Robot Played : {robot}")

        if player == robot:

            print("\n❌ YOU ARE OUT!")
            print(f"Your Final Score : {score}")

            return score

        score += player

        print(f"You Scored : {player}")
        print(f"Total Score: {score}")

        if score >= target:

            print("\n🎉 Target Reached!")
            return score

        print(f"Need {target - score} more runs.\n")


# -----------------------------
# ROBOT CHASES
# -----------------------------

def chase_by_robot(target):

    print("\n========== SECOND INNINGS ==========")
    print(f"🤖 Robot needs {target} runs to win.\n")

    score = 0

    while True:

        player = get_player_run()

        # Developer Command
        if player == "LOG_BOWLED":

            robot = robot_run()

            print(f"🤖 Robot Played : {robot}")
            print("\n📝 Developer Command: log bowled")
            print("❌ ROBOT OUT!")
            print(f"Robot Final Score : {score}")

            return score

        robot = robot_run()

        print(f"🤖 Robot Played : {robot}")

        if player == robot:

            print("\n❌ ROBOT OUT!")
            print(f"Robot Final Score : {score}")

            return score

        score += robot

        print(f"Robot Scored : {robot}")
        print(f"Robot Total  : {score}")

        if score >= target:

            print("\n🤖 Robot reached the target!")
            return score

        print(f"Robot needs {target - score} more runs.\n")


# -----------------------------
# SECOND INNINGS CONTROLLER
# -----------------------------

def second_innings(choice, target):

    if choice == "bat":

        robot_score = chase_by_robot(target)
        return robot_score

    else:

        player_score = chase_by_player(target)
        return player_score


# -----------------------------
# MATCH RESULT
# -----------------------------

def declare_result(player_score, robot_score):

    global matches_played
    global player_wins
    global robot_wins
    global draws
    global highest_player_score
    global highest_robot_score

    matches_played += 1

    highest_player_score = max(highest_player_score, player_score)
    highest_robot_score = max(highest_robot_score, robot_score)

    print("\n========== MATCH RESULT ==========")

    print(f"🏏 Your Score  : {player_score}")
    print(f"🤖 Robot Score : {robot_score}\n")

    if player_score > robot_score:

        print("🏆 Congratulations! You Win!")
        player_wins += 1

    elif robot_score > player_score:

        print("🤖 Robot Wins!")
        robot_wins += 1

    else:

        print("🤝 Match Draw!")
        draws += 1

    print("==================================")
    
# ==========================================
# PART 4 - STATISTICS & MAIN GAME
# ==========================================

# -----------------------------
# SHOW STATISTICS
# -----------------------------

def show_stats():

    print("\n========== STATISTICS ==========")
    print(f"Matches Played      : {matches_played}")
    print(f"Player Wins         : {player_wins}")
    print(f"Robot Wins          : {robot_wins}")
    print(f"Draws               : {draws}")
    print(f"Highest Player Score: {highest_player_score}")
    print(f"Highest Robot Score : {highest_robot_score}")
    print(f"Difficulty          : {difficulty.upper()}")
    print("================================")


# -----------------------------
# PLAY ONE MATCH
# -----------------------------

def play_match():

    show_title()

    choose_difficulty()

    choice = toss()

    player_score, robot_score, target = first_innings(choice)

    if choice == "bat":

        robot_score = second_innings(choice, target)

    else:

        player_score = second_innings(choice, target)

    declare_result(player_score, robot_score)

    show_stats()


# -----------------------------
# MAIN MENU
# -----------------------------

def main():

    print("Welcome to Hand Cricket Terminal!\n")

    while True:

        play_match()

        while True:

            again = input("\nContinue? (y/n): ").strip().lower()

            if again == "y":

                print("\nStarting a new match...\n")
                break

            elif again == "n":

                print("\n========== FINAL STATISTICS ==========")
                print(f"Matches Played      : {matches_played}")
                print(f"Player Wins         : {player_wins}")
                print(f"Robot Wins          : {robot_wins}")
                print(f"Draws               : {draws}")
                print(f"Highest Player Score: {highest_player_score}")
                print(f"Highest Robot Score : {highest_robot_score}")
                print("======================================")

                print("\n👋 Thanks for playing Hand Cricket Terminal!")
                return

            else:

                print("Please enter y or n.")


# -----------------------------
# PROGRAM START
# -----------------------------

if __name__ == "__main__":

    main()                                            
