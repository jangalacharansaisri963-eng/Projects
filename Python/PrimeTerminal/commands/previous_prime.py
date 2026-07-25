from prime import previous_prime


def run(args):

    if len(args) != 3:
        print("Usage: previous prime <number>")
        return

    try:
        number = int(args[2])

        result = previous_prime(number)

        if result is None:
            print("No previous prime exists.")
        else:
            print(result)

    except ValueError:
        print("Invalid number.")
