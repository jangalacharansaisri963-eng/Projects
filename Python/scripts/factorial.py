import math


def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result


def double_factorial(n):
    result = 1
    while n > 0:
        result *= n
        n -= 2
    return result


def triple_factorial(n):
    result = 1
    while n > 0:
        result *= n
        n -= 3
    return result


def superfactorial(n):
    result = 1

    for i in range(1, n + 1):
        result *= factorial(i)

    return result


def hyperfactorial(n):
    result = 1

    for i in range(1, n + 1):
        result *= i ** i

    return result


def primorial(n):

    result = 1

    for i in range(2, n + 1):

        prime = True

        for j in range(2, int(math.sqrt(i))+1):
            if i % j == 0:
                prime = False
                break

        if prime:
            result *= i

    return result
    
# 11. Factorial Ratio
def factorial_ratio(n, r):
    if r > n:
        return None

    result = 1

    for i in range(r + 1, n + 1):
        result *= i

    return result


# 12. Binomial coefficient nCr
def binomial(n, r):

    if r < 0 or r > n:
        return 0

    return factorial(n) // (factorial(r) * factorial(n-r))


# 13. Permutation nPr
def permutation(n, r):

    if r < 0 or r > n:
        return 0

    return factorial(n) // factorial(n-r)


# 14. Catalan Number
def catalan(n):

    return factorial(2*n) // (factorial(n+1) * factorial(n))


# 15. Bell Number
def bell_number(n):

    bell = [[0]*(n+1) for _ in range(n+1)]

    bell[0][0] = 1

    for i in range(1,n+1):

        bell[i][0] = bell[i-1][i-1]

        for j in range(1,i+1):
            bell[i][j] = bell[i-1][j-1] + bell[i][j-1]

    return bell[n][0]


# 16. Stirling Number Second Kind
def stirling_second(n,k):

    if n == 0 and k == 0:
        return 1

    if k == 0 or k > n:
        return 0

    return (
        k * stirling_second(n-1,k)
        +
        stirling_second(n-1,k-1)
    )


# 17. Factorial Modulo
def factorial_mod(n,m):

    result = 1

    for i in range(2,n+1):
        result = (result*i) % m

    return result



# 18. Trailing zeros in factorial
def trailing_zeros(n):

    count = 0

    while n > 0:
        n //= 5
        count += n

    return count



# 19. Number of digits in factorial
def factorial_digits(n):

    if n < 2:
        return 1

    digits = 0

    for i in range(1,n+1):
        digits += math.log10(i)

    return int(digits)+1



# 20. Check if number is factorial
def is_factorial(number):

    result = 1
    i = 1

    while result < number:
        i += 1
        result *= i

    return result == number    



commands = {
    "factorial": factorial,
    "double_factorial": double_factorial,
    "triple_factorial": triple_factorial,
    "superfactorial": superfactorial,
    "hyperfactorial": hyperfactorial,
    "primorial": primorial
}



def help_command():

    print("""
========== FactorialTerminal Help ==========

BASIC FACTORIAL COMMANDS:

factorial(n)
    Normal factorial
    Example: factorial(5)

double_factorial(n)
    Double factorial n!!
    Example: double_factorial(10)

triple_factorial(n)
    Triple factorial n!!!
    Example: triple_factorial(10)

multifactorial(n,k)
    General multifactorial
    Example: multifactorial(10,3)


ADVANCED FACTORIAL COMMANDS:

rising_factorial(n,k)
    Rising factorial
    Example: rising_factorial(5,4)

falling_factorial(n,k)
    Falling factorial
    Example: falling_factorial(5,4)

superfactorial(n)
    Product of factorials
    Example: superfactorial(5)

hyperfactorial(n)
    Product of powers
    Example: hyperfactorial(5)

subfactorial(n)
    Derangement factorial
    Example: subfactorial(6)

left_factorial(n)
    Sum of previous factorials
    Example: left_factorial(10)


NUMBER THEORY COMMANDS:

primorial(n)
    Product of prime numbers
    Example: primorial(10)

is_factorial(n)
    Check if number is factorial
    Example: is_factorial(120)

factorial_ratio(n,r)
    Ratio of factorials
    Example: factorial_ratio(10,5)


COMBINATORICS COMMANDS:

binomial(n,r)
    Combination nCr
    Example: binomial(5,2)

permutation(n,r)
    Permutation nPr
    Example: permutation(5,2)

catalan(n)
    Catalan number
    Example: catalan(5)

bell_number(n)
    Bell number
    Example: bell_number(5)

stirling_second(n,k)
    Stirling number of second kind
    Example: stirling_second(5,2)


FACTORIAL ANALYSIS:

factorial_mod(n,m)
    Factorial modulo
    Example: factorial_mod(10,7)

trailing_zeros(n)
    Count zeros at end of factorial
    Example: trailing_zeros(100)

factorial_digits(n)
    Count digits in factorial
    Example: factorial_digits(50)

factorial_sum(n)
    Sum digits of factorial
    Example: factorial_sum(10)


SYSTEM COMMANDS:

help
    Show this help menu

about
    Show program information

version
    Show version

clear
    Clear terminal screen

history
    Show command history

exit
    Close FactorialTerminal


SYNTAX:

function_name(arguments)

Examples:

factorial(10)
binomial(20,5)
hyperfactorial(8)


============================================
""")


def run():

    print("FactorialTerminal")
    print("Type help for commands")

    while True:

        command = input("\n> ")

        if command == "help":
            help_command()


        elif command == "exit":
            print("Closing FactorialTerminal...")
            break


        else:

            try:

                name = command.split("(")[0]

                value = command.split("(")[1].replace(")", "")

                number = int(value)

                if name in commands:

                    result = commands[name](number)

                    print(result)

                    again = input("\nContinue? (y/n): ")

                    if again.lower() != "y":
                        print("Closing FactorialTerminal...")
                        break

                else:
                    print("Unknown command. Type help.")


            except:
                print("Invalid syntax.")
                print("Example: factorial(5)")


if __name__ == "__main__":
    run()