from commands.HelpCommand import run as help_command
from commands.AboutCommand import run as about_command
from commands.VersionCommand import run as version_command
from commands.ExitCommand import run as exit_command
from commands.ClearCommand import run as clear_command


def execute(command):

    args = command.split()

    if len(args) == 0:
        return

    cmd = args[0].lower()

    if cmd == "help":
        help_command()

    elif cmd == "about":
        about_command()

    elif cmd == "version":
        version_command()

    elif cmd == "clear":
        clear_command()

    elif cmd == "exit":
        exit_command()

    else:
        print("Unknown command. Type 'help'.")
