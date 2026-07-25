from prime import sum_primes


def run(args):

    if len(args) != 3:
        print("Usage: sum primes <number>")
        return

    try:
        limit = int(args[2])

        if limit < 2:
            print("Number must be at least 2.")
            return

        print(f"Sum of primes up to {limit}: {sum_primes(limit)}")

    except ValueError:
        print("Invalid number.")
