from prime import emirp_primes


def run(args):

    if len(args) != 3:
        print("Usage: emirp <number>")
        return

    try:
        limit = int(args[2])

        emirp_primes(limit)

    except ValueError:
        print("Invalid number.")
