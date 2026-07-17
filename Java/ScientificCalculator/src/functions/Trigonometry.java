package functions;


/*
 * Trigonometry functions
 *
 * Uses radians.
 *
 */

public class Trigonometry {



    // ==========================
    // Basic Trig
    // ==========================

    public static double sin(
            double x
    ) {

        return Math.sin(x);

    }



    public static double cos(
            double x
    ) {

        return Math.cos(x);

    }



    public static double tan(
            double x
    ) {

        return Math.tan(x);

    }



    // ==========================
    // Inverse Trig
    // ==========================

    public static double arcsin(
            double x
    ) {

        return Math.asin(x);

    }



    public static double arccos(
            double x
    ) {

        return Math.acos(x);

    }



    public static double arctan(
            double x
    ) {

        return Math.atan(x);

    }



    // ==========================
    // Reciprocal Inverse Trig
    // ==========================

    public static double arcsec(
            double x
    ) {

        if (x == 0) {

            throw new ArithmeticException(
                    "arcsec undefined"
            );

        }


        return Math.acos(
                1 / x
        );

    }



    public static double arccosec(
            double x
    ) {

        if (x == 0) {

            throw new ArithmeticException(
                    "arccosec undefined"
            );

        }


        return Math.asin(
                1 / x
        );

    }



    public static double arccotan(
            double x
    ) {

        return Math.atan(
                1 / x
        );

    }



    // ==========================
    // Degree Conversion
    // ==========================

    public static double toRadians(
            double degrees
    ) {

        return Math.toRadians(
                degrees
        );

    }



    public static double toDegrees(
            double radians
    ) {

        return Math.toDegrees(
                radians
        );

    }


}
