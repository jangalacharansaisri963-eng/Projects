from prime import prime_factors


def run(args):

    if len(args) != 3:
        print("Usage: prime factors <number>")
        return

    try:
        number = int(args[2])

        factors = prime_factors(number)

        print(f"Prime factors of {number}:")

        for factor in factors:
            print(factor)

    except ValueError:
        print("Invalid number.")
