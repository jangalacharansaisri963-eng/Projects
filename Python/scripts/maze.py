# ==========================================
# MAZE GENERATOR TERMINAL
# Version 1.0
# ==========================================

import random


def create_maze(rows, cols):

    maze = []

    for r in range(rows):
        row = []

        for c in range(cols):

            if r == 0 or c == 0 or r == rows - 1 or c == cols - 1:
                row.append("#")

            else:
                if random.choice([True, False]):
                    row.append("#")
                else:
                    row.append(" ")

        maze.append(row)

    # Start and End
    maze[1][1] = "S"
    maze[rows - 2][cols - 2] = "E"

    return maze


def display_maze(maze):

    for row in maze:
        print("".join(row))


print("=" * 45)
print("          MAZE GENERATOR TERMINAL")
print("              Version 1.0")
print("=" * 45)


while True:

    try:

        rows = int(input("\nEnter maze height: "))
        cols = int(input("Enter maze width: "))

        maze = create_maze(rows, cols)

        print("\nGenerated Maze:\n")

        display_maze(maze)

    except ValueError:
        print("\nEnter numbers only!")

    choice = input("\nGenerate another maze? (y/n): ").lower()

    if choice != "y":
        print("\nThanks for using Maze Generator!")
        break