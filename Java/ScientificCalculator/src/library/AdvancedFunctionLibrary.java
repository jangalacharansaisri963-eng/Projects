package library;

import functions.Factorial;

/*
 * AdvancedFunctionLibrary
 *
 * Registers advanced mathematical functions.
 */

public class AdvancedFunctionLibrary {

    public static void register() {

        // ==========================
        // Factorials
        // ==========================

        FunctionLibrary.FUNCTIONS.put(
            "factorial",
            Factorial::factorial
        );

        FunctionLibrary.FUNCTIONS.put(
            "fact",
            Factorial::factorial
        );

        FunctionLibrary.FUNCTIONS.put(
            "doublefactorial",
            Factorial::doubleFactorial
        );

        FunctionLibrary.FUNCTIONS.put(
            "dfact",
            Factorial::doubleFactorial
        );

        FunctionLibrary.FUNCTIONS.put(
            "superfactorial",
            Factorial::superFactorial
        );

        FunctionLibrary.FUNCTIONS.put(
            "sfact",
            Factorial::superFactorial
        );

        FunctionLibrary.FUNCTIONS.put(
            "hyperfactorial",
            Factorial::hyperFactorial
        );

        FunctionLibrary.FUNCTIONS.put(
            "hfact",
            Factorial::hyperFactorial
        );

        FunctionLibrary.FUNCTIONS.put(
            "primefactorial",
            Factorial::primeFactorial
        );

        FunctionLibrary.FUNCTIONS.put(
            "pfact",
            Factorial::primeFactorial
        );

    }

}
