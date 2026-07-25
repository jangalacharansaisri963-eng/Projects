from prime import palindrome_primes


def run(args):

    if len(args) != 3:
        print("Usage: palindrome primes <number>")
        return

    try:
        limit = int(args[2])

        palindrome_primes(limit)

    except ValueError:
        print("Invalid number.")
