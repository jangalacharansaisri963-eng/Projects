"""
Prime Terminal — thin menu / launcher.

All logic lives in commands/. This file only builds function-call strings
and hands them to execute_command.
"""

from __future__ import annotations

from commands import execute_command


def run_command(line: str) -> None:
    execute_command(line)


def run_menu() -> None:
    menu = """
========== PrimeTerminal ==========
1.  is_prime(n)
2.  generate_primes(limit)
3.  find_primes(start, end)
4.  count_primes(limit)
5.  next_prime(n)
6.  previous_prime(n)
7.  nth_prime(n)
8.  prime_factors(n)
9.  stats(limit)
10. random_prime(start, end)
11. twin_primes(limit)
12. goldbach(n)
13. prime_table(limit)
14. mersenne_primes(limit)
15. palindrome_primes(limit)
16. emirp_primes(limit)
17. check_twin(n)
18. prime_gap(n)
19. help()
20. exit()
===================================
"""
    while True:
        print(menu)
        choice = input("Choose an option: ").strip()
        try:
            if choice == "1":
                n = input("n = ").strip()
                run_command(f"is_prime({n})")
            elif choice == "2":
                n = input("limit = ").strip()
                run_command(f"generate_primes({n})")
            elif choice == "3":
                a = input("start = ").strip()
                b = input("end = ").strip()
                run_command(f"find_primes({a}, {b})")
            elif choice == "4":
                n = input("limit = ").strip()
                run_command(f"count_primes({n})")
            elif choice == "5":
                n = input("n = ").strip()
                run_command(f"next_prime({n})")
            elif choice == "6":
                n = input("n = ").strip()
                run_command(f"previous_prime({n})")
            elif choice == "7":
                n = input("n = ").strip()
                run_command(f"nth_prime({n})")
            elif choice == "8":
                n = input("n = ").strip()
                run_command(f"prime_factors({n})")
            elif choice == "9":
                n = input("limit = ").strip()
                run_command(f"stats({n})")
            elif choice == "10":
                a = input("start = ").strip()
                b = input("end = ").strip()
                run_command(f"random_prime({a}, {b})")
            elif choice == "11":
                n = input("limit = ").strip()
                run_command(f"twin_primes({n})")
            elif choice == "12":
                n = input("even n = ").strip()
                run_command(f"goldbach({n})")
            elif choice == "13":
                n = input("limit = ").strip()
                run_command(f"prime_table({n})")
            elif choice == "14":
                n = input("limit = ").strip()
                run_command(f"mersenne_primes({n})")
            elif choice == "15":
                n = input("limit = ").strip()
                run_command(f"palindrome_primes({n})")
            elif choice == "16":
                n = input("limit = ").strip()
                run_command(f"emirp_primes({n})")
            elif choice == "17":
                n = input("n = ").strip()
                run_command(f"check_twin({n})")
            elif choice == "18":
                n = input("n = ").strip()
                run_command(f"prime_gap({n})")
            elif choice == "19":
                run_command("help()")
            elif choice == "20":
                run_command("exit()")
            else:
                print("Invalid option.")
        except SystemExit:
            raise
        except Exception as exc:
            print(f"Error: {exc}")


def main() -> None:
    print("Prime Terminal — menu mode")
    print("Tip: run  python main.py  for the Python-style interpreter.\n")
    run_menu()


if __name__ == "__main__":
    main()
