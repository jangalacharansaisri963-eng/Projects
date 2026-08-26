"""prime_table(limit, columns=10) — primes in table layout."""

from commands.helpers import iter_primes_upto


def prime_table(limit: int, columns: int = 10) -> None:
    limit = int(limit)
    columns = int(columns) if columns else 10
    if columns < 1:
        columns = 10
    count = 0
    for p in iter_primes_upto(limit):
        print(f"{p:<8}", end="")
        count += 1
        if count % columns == 0:
            print()
    if count % columns != 0:
        print()
    if count == 0:
        print("No primes found.")
