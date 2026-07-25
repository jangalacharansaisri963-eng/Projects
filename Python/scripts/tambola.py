import random

print("========== Tambola Number Generator ==========")
print("Press ENTER to call the next number.")
print("Type 'q' and press ENTER to quit.\n")

numbers = list(range(1, 91))
random.shuffle(numbers)

index = 0

while index < len(numbers):

    command = input()

    if command.lower() == "q":
        print("Goodbye!")
        break

    print(f"🎱 Number Called: {numbers[index]}")
    print(f"Numbers Remaining: {89 - index}")

    index += 1

if index == len(numbers):
    print("\n🎉 All 90 numbers have been called!")
    print("Goodbye!")