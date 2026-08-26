"""help() — show available functions."""


def help() -> None:  # noqa: A001
    print("""
==========================================
        Prime Terminal — function help
==========================================

Call functions like Python:

  is_prime(17)
  generate_primes(50)
  find_primes(10, 40)
  count_primes(100)
  next_prime(20)
  previous_prime(20)
  nth_prime(5)
  prime_factors(84)
  sum_primes(50)
  largest_prime(100)
  random_prime(10, 50)
  twin_primes(50)
  check_twin(17)
  prime_gap(20)
  prime_table(50)
  prime_table(50, 5)
  mersenne_primes(10)
  palindrome_primes(200)
  emirp_primes(200)
  goldbach(28)
  stats(100)

General:
  help()
  about()
  version()
  clear()
  history()
  save("name.txt")
  load("name.txt")
  exit()

==========================================
""")
