package library;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * FunctionLibrary
 *
 * Main registry for all calculator functions.
 */

public class FunctionLibrary {

    // =========================================
    // Function Interface
    // =========================================

    @FunctionalInterface
    public interface CalculatorFunction {

        double apply(List<Double> arguments);

    }

    // =========================================
    // Function Registry
    // =========================================

    public static final Map<String, CalculatorFunction> FUNCTIONS =
            new HashMap<>();

    // =========================================
    // Initialize
    // =========================================

    public static void initialize() {

        FUNCTIONS.clear();

        BasicFunctionLibrary.register();

        AdvancedFunctionLibrary.register();

        EquationFunctionLibrary.register();

        ConstantLibrary.register();

    }

    // =========================================
    // Register Function
    // =========================================

    public static void register(
            String name,
            CalculatorFunction function
    ) {

        FUNCTIONS.put(
                name.toLowerCase(),
                function
        );

    }

    // =========================================
    // Function Exists
    // =========================================

    public static boolean exists(
            String name
    ) {

        return FUNCTIONS.containsKey(
                name.toLowerCase()
        );

    }

    // =========================================
    // Call Function
    // =========================================

    public static double call(
            String name,
            List<Double> arguments
    ) {

        CalculatorFunction function =
                FUNCTIONS.get(
                        name.toLowerCase()
                );

        if (function == null) {

            throw new RuntimeException(
                    "Unknown function: " + name
            );

        }

        return function.apply(arguments);

    }

}
