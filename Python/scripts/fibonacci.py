def generate_fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b


def main():
    print("=" * 40)
    print("      FIBONACCI GENERATOR")
    print("=" * 40)

    while True:
        try:
            n = int(input("\nEnter number of terms: "))

            if n <= 0:
                print("Please enter a positive integer.")
                continue

            print("\nFibonacci Sequence:\n")

            for num in generate_fibonacci(n):
                print(num, end=" ")

            print()

            again = input("\nGenerate another? (Y/N): ").upper()

            if again != "Y":
                print("\nGoodbye!")
                break

        except ValueError:
            print("Invalid input!")


if __name__ == "__main__":
    main()