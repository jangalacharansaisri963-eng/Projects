from prime import generate_primes


def run(args):

    if len(args) != 3:
        print("Usage: generate primes <number>")
        return

    try:
        limit = int(args[2])

        if limit < 2:
            print("Number must be at least 2.")
            return

        generate_primes(limit)

    except ValueError:
        print("Invalid number.")
