from prime import count_primes


def run(args):

    if len(args) != 3:
        print("Usage: count primes <number>")
        return

    try:
        limit = int(args[2])

        if limit < 2:
            print("Number must be at least 2.")
            return

        total = count_primes(limit)

        print(f"There are {total} prime numbers up to {limit}.")

    except ValueError:
        print("Invalid number.")
