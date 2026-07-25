from prime import goldbach


def run(args):

    if len(args) != 3:
        print("Usage: goldbach <even number>")
        return

    try:
        number = int(args[2])

        goldbach(number)

    except ValueError:
        print("Invalid number.")
