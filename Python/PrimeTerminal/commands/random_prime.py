from prime import random_prime


def run(args):

    if len(args) != 4:
        print("Usage: random prime <start> <end>")
        return

    try:
        start = int(args[2])
        end = int(args[3])

        result = random_prime(start, end)

        if result is None:
            print("No prime found in that range.")
        else:
            print(f"Random prime: {result}")

    except ValueError:
        print("Invalid numbers.")
