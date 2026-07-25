from prime import next_prime


def run(args):

    if len(args) != 3:
        print("Usage: next prime <number>")
        return

    try:
        number = int(args[2])

        print(next_prime(number))

    except ValueError:
        print("Invalid number.")
