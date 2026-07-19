package functions;

public class Factorial {

    // ==========================
    // Factorial
    // ==========================

    public static long factorial(int n) {

        if (n < 0) {
            throw new ArithmeticException(
                    "Factorial undefined for negative numbers"
            );
        }

        long result = 1;

        for (int i = 2; i <= n; i++) {
            result *= i;
        }

        return result;

    }

    // ==========================
    // Double Factorial
    // n!!
    // ==========================

    public static long doubleFactorial(int n) {

        if (n < 0) {
            throw new ArithmeticException(
                    "Double factorial undefined for negative numbers"
            );
        }

        long result = 1;

        for (int i = n; i > 1; i -= 2) {
            result *= i;
        }

        return result;

    }

    // ==========================
    // Super Factorial
    // sf(n) = 1! × 2! × ... × n!
    // ==========================

    public static double superFactorial(int n) {

        if (n < 0) {
            throw new ArithmeticException(
                    "Super factorial undefined for negative numbers"
            );
        }

        double result = 1.0;

        for (int i = 1; i <= n; i++) {
            result *= factorial(i);
        }

        return result;

    }

    // ==========================
    // Hyper Factorial
    // H(n) = ∏ k^k
    // ==========================

    public static double hyperFactorial(int n) {

        if (n < 0) {
            throw new ArithmeticException(
                    "Hyper factorial undefined for negative numbers"
            );
        }

        double result = 1.0;

        for (int i = 1; i <= n; i++) {
            result *= Math.pow(i, i);
        }

        return result;

    }

    // ==========================
    // Primorial
    // Product of all primes <= n
    // ==========================

    public static long primorial(int n) {

        if (n < 2) {
            return 1;
        }

        long result = 1;

        for (int i = 2; i <= n; i++) {

            if (isPrime(i)) {
                result *= i;
            }

        }

        return result;

    }

    // ==========================
    // Subfactorial
    // !n (Derangements)
    // ==========================

    public static long subFactorial(int n) {

        if (n < 0) {
            throw new ArithmeticException(
                    "Subfactorial undefined for negative numbers"
            );
        }

        if (n == 0) return 1;
        if (n == 1) return 0;

        long a = 1;
        long b = 0;

        for (int i = 2; i <= n; i++) {

            long temp = (i - 1) * (a + b);

            a = b;
            b = temp;

        }

        return b;

    }

    // ==========================
    // Prime Test
    // ==========================

    private static boolean isPrime(int n) {

        if (n < 2) {
            return false;
        }

        for (int i = 2; i * i <= n; i++) {

            if (n % i == 0) {
                return false;
            }

        }

        return true;

    }

}
