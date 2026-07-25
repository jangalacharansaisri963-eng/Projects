import os


SAVE_FOLDER = "saves"


def save_output(filename, text=""):

    os.makedirs(SAVE_FOLDER, exist_ok=True)

    path = os.path.join(SAVE_FOLDER, filename)

    with open(path, "w", encoding="utf-8") as file:
        file.write(text)

    print(f"Saved to {path}")


def load_output(filename):

    path = os.path.join(SAVE_FOLDER, filename)

    if not os.path.exists(path):
        print("File not found.")
        return

    with open(path, "r", encoding="utf-8") as file:
        print(file.read())
