from commands import execute_command

VERSION = "1.0.0"

print("=" * 45)
print("        Prime Terminal v" + VERSION)
print("        Developed by Dan Studios")
print("=" * 45)
print("Type 'help' to see all commands.\n")

while True:
    try:
        command = input("Prime> ").strip()

        if command == "":
            continue

        execute_command(command)

    except KeyboardInterrupt:
        print("\nUse 'exit' to quit Prime Terminal.")

    except Exception as e:
        print(f"Error: {e}")
