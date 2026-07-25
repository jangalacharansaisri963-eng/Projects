from filemanager import load_output


def run(args):

    if len(args) != 2:
        print("Usage: load <filename>")
        return

    load_output(args[1])
