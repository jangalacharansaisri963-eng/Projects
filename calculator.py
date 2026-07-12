import sys
print("DEBUG: Terminal is active")
sys.stdout.flush()
cmd = sys.stdin.readline()
print(f"DEBUG: You typed {cmd}")
