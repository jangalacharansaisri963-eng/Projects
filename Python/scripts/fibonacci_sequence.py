def generate_fibonacci(n):
    a, b = 0, 1

    for _ in range(n):
        print(a, end=" ")
        a, b = b, a + b

    print()


def main():
    print("=" * 45)
    print("      FIBONACCI SEQUENCE GENERATOR")
    print("=" * 45)

    while True:
        try:
            terms = int(input("\nEnter the number of terms: "))

            if terms <= 0:
                print("Please enter a positive integer.")
                continue

        except ValueError:
            print("Invalid input! Please enter a whole number.")
            continue

        print("\nFibonacci Sequence:")
        generate_fibonacci(terms)

        while True:
            again = input("\nGenerate another? (Y/N): ").strip().upper()

            if again == "Y":
                break
            elif again == "N":
                print("\nThank you for using Fibonacci Sequence Generator!")
                return
            else:
                print("Please enter Y or N.")


if __name__ == "__main__":
    main()