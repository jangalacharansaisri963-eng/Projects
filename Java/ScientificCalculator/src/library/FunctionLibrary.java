package library;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import constants.Constants;

import functions.Arithmetic;
import functions.Roots;
import functions.Logarithms;
import functions.Trigonometry;
import functions.Factorial;
import functions.Quadratic;



public class FunctionLibrary {



    public static final Map<String, Function<Double, Double>> FUNCTIONS =
            new HashMap<>();


    public static final Map<String, Double> CONSTANTS =
            new HashMap<>();



    // ==========================
    // Initialize
    // ==========================

    public static void initialize() {



        // ==========================
        // Roots
        // ==========================

        FUNCTIONS.put(
            "sqrt",
            Roots::sqrt
        );


        FUNCTIONS.put(
            "cbrt",
            Roots::cbrt
        );



        // ==========================
        // Logarithms
        // ==========================

        FUNCTIONS.put(
            "ln",
            Logarithms::ln
        );


        FUNCTIONS.put(
            "log",
            Logarithms::log
        );



        // ==========================
        // Trigonometry
        // ==========================

        FUNCTIONS.put(
            "sin",
            Trigonometry::sin
        );


        FUNCTIONS.put(
            "cos",
            Trigonometry::cos
        );


        FUNCTIONS.put(
            "tan",
            Trigonometry::tan
        );


        FUNCTIONS.put(
            "arcsin",
            Trigonometry::arcsin
        );


        FUNCTIONS.put(
            "arccos",
            Trigonometry::arccos
        );


        FUNCTIONS.put(
            "arctan",
            Trigonometry::arctan
        );



        // ==========================
        // Constants
        // ==========================

        CONSTANTS.put(
            "pi",
            Math.PI
        );


        CONSTANTS.put(
            "PI",
            Math.PI
        );


        CONSTANTS.put(
            "e",
            Math.E
        );


        CONSTANTS.put(
            "E",
            Math.E
        );

    }





    // ==========================
    // Function Exists
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
                "Unknown function: "
                + name
            );

        }


        return FUNCTIONS
                .get(name)
                .apply(value);

    }





    // ==========================
    // Constant Exists
    // ==========================

    public static boolean constantExists(
            String name
    ) {

        return CONSTANTS.containsKey(
                name
        );

    }





    // ==========================
    // Get Constant
    // ==========================

    public static double constant(
            String name
    ) {


        if (!constantExists(name)) {

            throw new RuntimeException(
                "Unknown constant: "
                + name
            );

        }


        return CONSTANTS.get(
                name
        );

    }


}
