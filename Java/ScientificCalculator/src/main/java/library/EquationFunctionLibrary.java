package library;

import functions.Quadratic;

/*
 * EquationFunctionLibrary
 *
 * Registers equation-related functions.
 */

public class EquationFunctionLibrary {

    public static void register() {

        /*
         * Quadratic Solver
         *
         * Usage:
         * quadratic(a, b, c)
         */

        FunctionLibrary.register(
                "quadratic",
                arguments -> {

                    if (arguments.size() != 3) {

                        throw new RuntimeException(
                                "quadratic(a,b,c) requires exactly 3 arguments."
                        );

                    }

                    return Quadratic.solve(
                            arguments.get(0),
                            arguments.get(1),
                            arguments.get(2)
                    );

                }
        );

    }

}
