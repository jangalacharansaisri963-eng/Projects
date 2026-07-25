from prime import find_primes


def run(args):

    if len(args) != 4:
        print("Usage: find primes <start> <end>")
        return

    try:
        start = int(args[2])
        end = int(args[3])

        if start > end:
            print("Start cannot be greater than end.")
            return

        find_primes(start, end)

    except ValueError:
        print("Invalid numbers.")
