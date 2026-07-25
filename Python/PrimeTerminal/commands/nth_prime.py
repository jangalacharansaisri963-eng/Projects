from prime import nth_prime


def run(args):

    if len(args) != 3:
        print("Usage: nth prime <number>")
        return

    try:
        n = int(args[2])

        if n < 1:
            print("Number must be greater than 0.")
            return

        print(f"The {n}th prime is {nth_prime(n)}.")

    except ValueError:
        print("Invalid number.")
