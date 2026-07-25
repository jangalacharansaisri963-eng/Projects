from history_manager import show_history


def run(args):

    if len(args) != 1:
        print("Usage: history")
        return

    show_history()
