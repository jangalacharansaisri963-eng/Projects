import random

answer = random.randint(1, 100)

while True:

    guess = int(input("Guess (1-100): "))

    if guess < answer:
        print("Too low!")

    elif guess > answer:
        print("Too high!")

    else:
        print("Correct!")
        break