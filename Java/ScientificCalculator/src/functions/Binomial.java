package functions;


/*
 * Binomial
 *
 * Expands:
 *
 * (a + b)^n
 * (a - b)^n
 *
 */

public class Binomial {


    // ==========================
    // Plus Expansion
    //
    // (a+b)^n
    // ==========================

    public static String expandPlus(
            String a,
            String b,
            int n
    ) {

        return expand(
                a,
                b,
                n,
                true
        );

    }



    // ==========================
    // Minus Expansion
    //
    // (a-b)^n
    // ==========================

    public static String expandMinus(
            String a,
            String b,
            int n
    ) {

        return expand(
                a,
                b,
                n,
                false
        );

    }



    // ==========================
    // Pascal Row
    // ==========================

    public static String pascalRow(
            int n
    ) {


        StringBuilder result =
                new StringBuilder();


        for (
                int k = 0;
                k <= n;
                k++
        ) {


            result.append(
                    combination(n,k)
            );


            if (k != n) {

                result.append(", ");

            }

        }


        return result.toString();

    }



    // ==========================
    // Expansion Engine
    // ==========================

    private static String expand(
            String a,
            String b,
            int n,
            boolean plus
    ) {


        StringBuilder result =
                new StringBuilder();


        for (
                int i = 0;
                i <= n;
                i++
        ) {


            int coefficient =
                    combination(n,i);



            int powerA =
                    n-i;


            int powerB =
                    i;



            if (i > 0) {


                if (plus || i % 2 == 0) {

                    result.append(" + ");

                }

                else {

                    result.append(" - ");

                }

            }



            if (coefficient != 1) {

                result.append(coefficient);

            }



            if (powerA > 0) {

                result.append(a);

                if (powerA > 1) {

                    result.append("^")
                          .append(powerA);

                }

            }



            if (powerB > 0) {


                result.append(b);


                if (powerB > 1) {

                    result.append("^")
                          .append(powerB);

                }

            }


        }


        return result.toString();

    }



    // ==========================
    // Combination
    // nCr
    // ==========================

    private static int combination(
            int n,
            int r
    ) {


        return factorial(n)
                /
                (
                    factorial(r)
                    *
                    factorial(n-r)
                );

    }



    private static int factorial(
            int n
    ) {

        int result = 1;


        for (
                int i = 2;
                i <= n;
                i++
        ) {

            result *= i;

        }


        return result;

    }

}
