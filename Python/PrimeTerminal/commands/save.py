from filemanager import save_output


def run(args):

    if len(args) != 2:
        print("Usage: save <filename>")
        return

    save_output(args[1])
