from prime import prime_table


def run(args):

    if len(args) != 3:
        print("Usage: prime table <number>")
        return

    try:
        limit = int(args[2])

        prime_table(limit)

    except ValueError:
        print("Invalid number.")
