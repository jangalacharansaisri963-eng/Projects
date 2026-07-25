from prime import mersenne_primes


def run(args):

    if len(args) != 3:
        print("Usage: mersenne <number>")
        return

    try:
        limit = int(args[2])

        mersenne_primes(limit)

    except ValueError:
        print("Invalid number.")
