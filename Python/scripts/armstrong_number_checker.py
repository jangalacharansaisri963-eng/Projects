def is_armstrong(number):
    digits = str(number)
    power = len(digits)

    total = 0
    for digit in digits:
        total += int(digit) ** power

    return total == number


def main():
    print("=" * 45)
    print("       ARMSTRONG NUMBER CHECKER")
    print("=" * 45)

    while True:
        try:
            number = int(input("\nEnter a positive integer: "))

            if number < 0:
                print("Please enter a positive integer.")
                continue

        except ValueError:
            print("Invalid input! Please enter a whole number.")
            continue

        if is_armstrong(number):
            print(f"\n{number} is an Armstrong number. ✅")
        else:
            print(f"\n{number} is NOT an Armstrong number. ❌")

        while True:
            again = input("\nCheck another? (Y/N): ").strip().upper()

            if again == "Y":
                break
            elif again == "N":
                print("\nThank you for using Armstrong Number Checker!")
                return
            else:
                print("Please enter Y or N.")


if __name__ == "__main__":
    main()