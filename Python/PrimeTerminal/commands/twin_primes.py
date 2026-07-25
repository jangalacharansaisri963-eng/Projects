from prime import twin_primes


def run(args):

    if len(args) != 3:
        print("Usage: list twin primes <number>")
        return

    try:
        limit = int(args[2])

        pairs = twin_primes(limit)

        if not pairs:
            print("No twin primes found.")
            return

        print(f"Twin primes up to {limit}:\n")

        for a, b in pairs:
            print(f"({a}, {b})")

    except ValueError:
        print("Invalid number.")
