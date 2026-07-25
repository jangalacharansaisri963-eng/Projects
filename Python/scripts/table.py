print("=== Multiplication Table ===")

while True:
    number = int(input("Enter number: "))
    limit = int(input("Table up to: "))

    print()

    for i in range(1, limit + 1):
        print(f"{number} × {i} = {number * i}")

    again = input("\nContinue? (y/n): ").lower()

    if again != "y":
        print("Goodbye!")
        break