package functions;

public class Factorial {


    // ==========================
    // Factorial
    // ==========================

    public static long factorial(
            int n
    ) {

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

}
