package library;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;


import functions.Arithmetic;


public class FunctionLibrary {


    public static final Map<String, Function<Double, Double>> FUNCTIONS =
            new HashMap<>();



    // ==========================
    // Initialize Functions
    // ==========================

    public static void initialize() {


        FUNCTIONS.put(
            "sqrt",
            Arithmetic::sqrt
        );


        FUNCTIONS.put(
            "cbrt",
            Arithmetic::cbrt
        );

    }



    // ==========================
    // Check Function
    // ==========================

    public static boolean exists(
            String name
    ) {

        return FUNCTIONS.containsKey(
            name
        );

    }



    // ==========================
    // Call Function
    // ==========================

    public static double call(
            String name,
            double value
    ) {


        if (!exists(name)) {

            throw new RuntimeException(
                "Unknown function: " + name
            );

        }


        return FUNCTIONS.get(name)
                .apply(value);

    }

}
