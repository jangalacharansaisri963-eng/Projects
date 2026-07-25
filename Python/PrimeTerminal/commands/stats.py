from prime import prime_stats


def run(args):

    if len(args) != 3:
        print("Usage: stats <number>")
        return

    try:
        limit = int(args[2])

        prime_stats(limit)

    except ValueError:
        print("Invalid number.")
