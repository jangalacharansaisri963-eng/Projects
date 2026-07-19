package library;

/*
 * ConstantLibrary
 *
 * Registers all mathematical constants.
 */

public class ConstantLibrary {

    public static void register() {

        FunctionLibrary.register(
                "pi",
                args -> Math.PI
        );

        FunctionLibrary.register(
                "PI",
                args -> Math.PI
        );

        FunctionLibrary.register(
                "e",
                args -> Math.E
        );

        FunctionLibrary.register(
                "E",
                args -> Math.E
        );

        FunctionLibrary.register(
                "phi",
                args -> (1.0 + Math.sqrt(5.0)) / 2.0
        );

        FunctionLibrary.register(
                "R15",
                args -> constants.Constants.R15
        );

    }

}
