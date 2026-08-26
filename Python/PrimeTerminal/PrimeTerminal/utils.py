import os
import time


def clear():
    os.system("cls" if os.name == "nt" else "clear")


def separator(length=50):
    print("=" * length)


def title(text):

    separator()
    print(text.center(50))
    separator()


def pause():
    input("\nPress Enter to continue...")


def current_time():
    return time.perf_counter()
