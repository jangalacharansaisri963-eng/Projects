from prime import check_twin


def run(args):

    if len(args) != 3:
        print("Usage: check twin <number>")
        return

    try:
        number = int(args[2])

        if check_twin(number):
            print(f"{number} belongs to a twin prime pair.")
        else:
            print(f"{number} is not part of a twin prime pair.")

    except ValueError:
        print("Invalid number.")
