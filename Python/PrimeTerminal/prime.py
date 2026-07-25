import math
import random


def is_prime(n):
    """
    Returns True if n is prime.
    """

    if n < 2:
        return False

    if n == 2:
        return True

    if n % 2 == 0:
        return False

    limit = int(math.sqrt(n)) + 1

    for i in range(3, limit, 2):
        if n % i == 0:
            return False

    return True


def generate_primes(limit):
    """
    Prints all prime numbers up to limit.
    """

    if limit < 2:
        print("No primes found.")
        return

    print()

    for number in range(2, limit + 1):
        if is_prime(number):
            print(number)


def find_primes(start, end):
    """
    Prints all primes between start and end.
    """

    if start > end:
        start, end = end, start

    print()

    for number in range(start, end + 1):
        if is_prime(number):
            print(number)


def count_primes(limit):
    """
    Returns the number of primes up to limit.
    """

    count = 0

    for number in range(2, limit + 1):
        if is_prime(number):
            count += 1

    return count


def next_prime(number):
    """
    Returns the next prime after number.
    """

    candidate = number + 1

    while True:
        if is_prime(candidate):
            return candidate

        candidate += 1


def previous_prime(number):
    """
    Returns the previous prime before number.
    """

    candidate = number - 1

    while candidate >= 2:

        if is_prime(candidate):
            return candidate

        candidate -= 1

    return None

def nth_prime(n):
    """
    Returns the nth prime number.
    """

    count = 0
    number = 1

    while count < n:
        number += 1

        if is_prime(number):
            count += 1

    return number


def prime_factors(number):
    """
    Returns a list of prime factors.
    """

    factors = []

    divisor = 2

    while divisor * divisor <= number:

        while number % divisor == 0:
            factors.append(divisor)
            number //= divisor

        divisor += 1

    if number > 1:
        factors.append(number)

    return factors


def sum_primes(limit):
    """
    Returns the sum of all primes up to limit.
    """

    total = 0

    for number in range(2, limit + 1):
        if is_prime(number):
            total += number

    return total


def largest_prime(limit):
    """
    Returns the largest prime less than or equal to limit.
    """

    for number in range(limit, 1, -1):

        if is_prime(number):
            return number

    return None


def random_prime(start, end):
    """
    Returns a random prime between start and end.
    """

    primes = []

    for number in range(start, end + 1):
        if is_prime(number):
            primes.append(number)

    if len(primes) == 0:
        return None

    return random.choice(primes)


def twin_primes(limit):
    """
    Returns a list of twin prime pairs.
    """

    pairs = []

    previous = None

    for number in range(2, limit + 1):

        if is_prime(number):

            if previous is not None and number - previous == 2:
                pairs.append((previous, number))

            previous = number

    return pairs

def check_twin(number):
    """
    Returns True if the given prime belongs
    to a twin prime pair.
    """

    if not is_prime(number):
        return False

    return is_prime(number - 2) or is_prime(number + 2)


def prime_gap(number):
    """
    Returns the gap between the previous
    and next prime surrounding the number.
    """

    previous = previous_prime(number)
    next_p = next_prime(number)

    if previous is None:
        return None

    return next_p - previous


def prime_table(limit, columns=10):
    """
    Prints primes in table format.
    """

    count = 0

    for number in range(2, limit + 1):

        if is_prime(number):
            print(f"{number:<8}", end="")
            count += 1

            if count % columns == 0:
                print()

    if count % columns != 0:
        print()


def mersenne_primes(limit):
    """
    Prints Mersenne primes up to limit.
    A Mersenne prime has the form 2^p - 1.
    """

    for p in range(2, limit + 1):

        if is_prime(p):

            mersenne = (2 ** p) - 1

            if is_prime(mersenne):
                print(mersenne)


def palindrome_primes(limit):
    """
    Prints palindromic primes.
    """

    for number in range(2, limit + 1):

        if is_prime(number):

            if str(number) == str(number)[::-1]:
                print(number)


def emirp_primes(limit):
    """
    Prints emirp primes.
    An emirp is a prime whose reverse
    is also prime and different.
    """

    for number in range(13, limit + 1):

        if is_prime(number):

            reverse = int(str(number)[::-1])

            if reverse != number and is_prime(reverse):
                print(number)

def goldbach(number):
    """
    Prints one Goldbach decomposition.
    Every even number > 2 can be written
    as the sum of two prime numbers.
    """

    if number <= 2 or number % 2 != 0:
        print("Goldbach only works for even numbers greater than 2.")
        return

    for first in range(2, number):

        if is_prime(first):

            second = number - first

            if is_prime(second):
                print(f"{number} = {first} + {second}")
                return

    print("No Goldbach decomposition found.")


def prime_stats(limit):
    """
    Displays statistics about primes up to limit.
    """

    primes = []

    for number in range(2, limit + 1):
        if is_prime(number):
            primes.append(number)

    if len(primes) == 0:
        print("No primes found.")
        return

    total = sum(primes)

    print("\n========== Prime Statistics ==========")
    print(f"Limit           : {limit}")
    print(f"Total Primes    : {len(primes)}")
    print(f"Smallest Prime  : {primes[0]}")
    print(f"Largest Prime   : {primes[-1]}")
    print(f"Sum of Primes   : {total}")
    print(f"Average Prime   : {total / len(primes):.2f}")

    if len(primes) > 1:
        gaps = []

        for i in range(1, len(primes)):
            gaps.append(primes[i] - primes[i - 1])

        print(f"Smallest Gap    : {min(gaps)}")
        print(f"Largest Gap     : {max(gaps)}")
        print(f"Average Gap     : {sum(gaps) / len(gaps):.2f}")

    print("======================================")

def main():
    while True:
        print("""
========== PrimeTerminal ==========
1. Check Prime
2. Generate Primes
3. Find Primes in Range
4. Count Primes
5. Next Prime
6. Previous Prime
7. Nth Prime
8. Prime Factors
9. Prime Statistics
10. Random Prime
11. Twin Primes
12. Goldbach
13. Exit
===================================
""")

        choice = input("Choose an option: ")

        try:
            if choice == "1":
                n = int(input("Enter number: "))
                print("Prime" if is_prime(n) else "Not Prime")

            elif choice == "2":
                limit = int(input("Limit: "))
                generate_primes(limit)

            elif choice == "3":
                start = int(input("Start: "))
                end = int(input("End: "))
                find_primes(start, end)

            elif choice == "4":
                limit = int(input("Limit: "))
                print("Count:", count_primes(limit))

            elif choice == "5":
                n = int(input("Number: "))
                print(next_prime(n))

            elif choice == "6":
                n = int(input("Number: "))
                print(previous_prime(n))

            elif choice == "7":
                n = int(input("Which prime: "))
                print(nth_prime(n))

            elif choice == "8":
                n = int(input("Number: "))
                print(prime_factors(n))

            elif choice == "9":
                n = int(input("Limit: "))
                prime_stats(n)

            elif choice == "10":
                start = int(input("Start: "))
                end = int(input("End: "))
                print(random_prime(start, end))

            elif choice == "11":
                limit = int(input("Limit: "))
                print(twin_primes(limit))

            elif choice == "12":
                n = int(input("Even number: "))
                goldbach(n)

            elif choice == "13":
                print("Closing PrimeTerminal...")
                break

            else:
                print("Invalid option.")

        except ValueError:
            print("Please enter valid numbers.")


if __name__ == "__main__":
    main()

          
