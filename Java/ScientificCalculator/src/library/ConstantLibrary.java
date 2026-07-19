package library;

import constants.Constants;

public class ConstantLibrary {

    public static void register() {

        FunctionLibrary.registerConstant(
                "pi",
                Constants.PI
        );

        FunctionLibrary.registerConstant(
                "e",
                Constants.E
        );

        FunctionLibrary.registerConstant(
                "phi",
                Constants.PHI
        );

        FunctionLibrary.registerConstant(
                "r15",
                Constants.R15
        );

    }

}
