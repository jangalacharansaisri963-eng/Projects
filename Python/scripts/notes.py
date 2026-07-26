# ==========================================
# NOTES APP TERMINAL
# Version 1.0
# ==========================================

import json
import os


FILE = "notes.json"


def load_notes():
    if os.path.exists(FILE):
        with open(FILE, "r") as file:
            return json.load(file)

    return []


def save_notes(notes):
    with open(FILE, "w") as file:
        json.dump(notes, file, indent=4)


def create_note(notes):

    title = input("\nEnter note title: ")
    content = input("Enter note content: ")

    note = {
        "title": title,
        "content": content
    }

    notes.append(note)
    save_notes(notes)

    print("\nNote saved!")


def view_notes(notes):

    if not notes:
        print("\nNo notes found!")
        return

    print("\n========== NOTES ==========")

    for i, note in enumerate(notes, 1):
        print(f"\n{i}. {note['title']}")
        print(note["content"])


def search_notes(notes):

    keyword = input("\nSearch keyword: ").lower()

    found = False

    for note in notes:

        if keyword in note["title"].lower():

            print("\nFound:")
            print("Title:", note["title"])
            print("Content:", note["content"])

            found = True

    if not found:
        print("\nNo matching notes!")


def delete_note(notes):

    view_notes(notes)

    try:
        number = int(input("\nDelete note number: "))

        notes.pop(number - 1)

        save_notes(notes)

        print("\nNote deleted!")

    except:
        print("\nInvalid selection!")


print("=" * 45)
print("             NOTES APP TERMINAL")
print("                Version 1.0")
print("=" * 45)


notes = load_notes()


while True:

    print("""
    
1. Create Note
2. View Notes
3. Search Notes
4. Delete Note
5. Exit

""")

    choice = input("Choose option: ")


    if choice == "1":
        create_note(notes)

    elif choice == "2":
        view_notes(notes)

    elif choice == "3":
        search_notes(notes)

    elif choice == "4":
        delete_note(notes)

    elif choice == "5":
        print("\nGoodbye!")
        break

    else:
        print("\nInvalid option!")