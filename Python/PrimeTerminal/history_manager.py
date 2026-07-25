history = []


def add(command):
    history.append(command)


def show_history():

    if len(history) == 0:
        print("No command history.")
        return

    print("\nCommand History\n")

    for i, cmd in enumerate(history, start=1):
        print(f"{i}. {cmd}")


def clear_history():
    history.clear()
