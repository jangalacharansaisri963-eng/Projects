from prime import largest_prime


def run(args):

    if len(args) != 3:
        print("Usage: largest prime <number>")
        return

    try:
        number = int(args[2])

        result = largest_prime(number)

        if result is None:
            print("No prime exists.")
        else:
            print(f"Largest prime <= {number}: {result}")

    except ValueError:
        print("Invalid number.")
