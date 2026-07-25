from prime import prime_gap


def run(args):

    if len(args) != 3:
        print("Usage: prime gap <number>")
        return

    try:
        number = int(args[2])

        print(f"Prime gap around {number}: {prime_gap(number)}")

    except ValueError:
        print("Invalid number.")
