package functions;


/*
 * Quadratic
 *
 * Solves:
 *
 * ax² + bx + c = 0
 *
 */

public class Quadratic {


    // ==========================
    // Discriminant
    //
    // Δ = b² - 4ac
    // ==========================

    public static double discriminant(
            double a,
            double b,
            double c
    ) {

        return (b * b) - (4 * a * c);

    }



    // ==========================
    // Nature of roots
    // ==========================

    public static String nature(
            double a,
            double b,
            double c
    ) {


        double d =
                discriminant(
                        a,
                        b,
                        c
                );


        if (d > 0) {

            return "Two distinct real roots";

        }


        else if (d == 0) {

            return "Two equal real roots";

        }


        else {

            return "Two complex roots";

        }

    }



    // ==========================
    // Repeated root
    //
    // x = -b / 2a
    // ==========================

    public static double repeatedRoot(
            double a,
            double b,
            double c
    ) {


        if (
            discriminant(a,b,c) != 0
        ) {

            throw new ArithmeticException(
                "Roots are not equal"
            );

        }


        return -b / (2 * a);

    }



    // ==========================
    // Solve quadratic
    // ==========================

    public static String quadratic(
            double a,
            double b,
            double c
    ) {


        if (a == 0) {

            throw new ArithmeticException(
                "Not a quadratic equation"
            );

        }


        double d =
                discriminant(
                        a,
                        b,
                        c
                );


        double root1 =
                (-b + Math.sqrt(d))
                /
                (2 * a);


        double root2 =
                (-b - Math.sqrt(d))
                /
                (2 * a);



        if (d < 0) {

            return "Complex roots";

        }


        return "("
                + root1
                + ", "
                + root2
                + ")";

    }


}
