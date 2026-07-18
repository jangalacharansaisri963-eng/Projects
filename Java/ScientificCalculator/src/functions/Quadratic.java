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
    // Root 1
    // ==========================

    public static double root1(
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

        if (d < 0) {

            throw new ArithmeticException(
                    "Complex roots"
            );

        }

        return (-b + Math.sqrt(d))
                /
                (2 * a);

    }



    // ==========================
    // Root 2
    // ==========================

    public static double root2(
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

        if (d < 0) {

            throw new ArithmeticException(
                    "Complex roots"
            );

        }

        return (-b - Math.sqrt(d))
                /
                (2 * a);

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
                discriminant(a, b, c) != 0
        ) {

            throw new ArithmeticException(
                    "Roots are not equal"
            );

        }

        return -b / (2 * a);

    }



    // ==========================
    // Axis of symmetry
    //
    // x = -b / 2a
    // ==========================

    public static double axisOfSymmetry(
            double a,
            double b,
            double c
    ) {

        if (a == 0) {

            throw new ArithmeticException(
                    "Not a quadratic equation"
            );

        }

        return -b / (2 * a);

    }



    // ==========================
    // Vertex X
    // ==========================

    public static double vertexX(
            double a,
            double b,
            double c
    ) {

        return axisOfSymmetry(
                a,
                b,
                c
        );

    }



    // ==========================
    // Vertex Y
    // ==========================

    public static double vertexY(
            double a,
            double b,
            double c
    ) {

        double x =
                vertexX(
                        a,
                        b,
                        c
                );

        return (a * x * x)
                +
                (b * x)
                +
                c;

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


        if (d < 0) {

            return "Complex roots";

        }


        if (d == 0) {

            return "("
                    +
                    repeatedRoot(
                            a,
                            b,
                            c
                    )
                    +
                    ")";

        }


        return "("
                +
                root1(
                        a,
                        b,
                        c
                )
                +
                ", "
                +
                root2(
                        a,
                        b,
                        c
                )
                +
                ")";

    }

}
