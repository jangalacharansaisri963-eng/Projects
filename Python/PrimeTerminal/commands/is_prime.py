from prime import is_prime


def run(args):

    if len(args) != 3:
        print("Usage: is prime <number>")
        return

    try:
        number = int(args[2])

        if is_prime(number):
            print(f"{number} is PRIME.")
        else:
            print(f"{number} is NOT PRIME.")

    except ValueError:
        print("Invalid number.")
