package functions;

public class Powers {


    // ==========================
    // Square
    // ==========================

    public static double square(
            double x
    ) {
        return x * x;
    }


    // ==========================
    // Cube
    // ==========================

    public static double cube(
            double x
    ) {
        return x * x * x;
    }


    // ==========================
    // Power
    // ==========================

    public static double power(
            double base,
            double exponent
    ) {
        return Math.pow(
            base,
            exponent
        );
    }


    // ==========================
    // nth Root
    // ==========================

    public static double root(
            double value,
            double n
    ) {

        if (n == 0) {
            throw new ArithmeticException(
                "Zeroth root is undefined"
            );
        }

        return Math.pow(
            value,
            1.0 / n
        );
    }


    // ==========================
    // Reciprocal
    // ==========================

    public static double reciprocal(
            double x
    ) {

        if (x == 0) {
            throw new ArithmeticException(
                "Division by zero"
            );
        }

        return 1.0 / x;
    }

}
