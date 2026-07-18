package parser;

import java.util.ArrayList;
import java.util.List;

import functions.Arithmetic;
import library.FunctionLibrary;

public class Parser {

    private final List<String> tokens;
    private int position = 0;

    public Parser(List<String> tokens) {
        this.tokens = tokens;
    }

    // ==========================
    // Entry
    // ==========================

    public double parse() {

        double value = parseExpression();

        if (position != tokens.size()) {
            throw new RuntimeException(
                    "Unexpected token: " + tokens.get(position)
            );
        }

        return value;
    }

    // ==========================
    // + -
    // ==========================

    private double parseExpression() {

        double value = parseTerm();

        while (position < tokens.size()) {

            String op = tokens.get(position);

            if (!op.equals("+") && !op.equals("-"))
                break;

            position++;

            double next = parseTerm();

            if (op.equals("+"))
                value = Arithmetic.add(value, next);
            else
                value = Arithmetic.subtract(value, next);
        }

        return value;
    }

    // ==========================
    // * /
    // ==========================

    private double parseTerm() {

        double value = parsePower();

        while (position < tokens.size()) {

            String op = tokens.get(position);

            if (!op.equals("*") && !op.equals("/"))
                break;

            position++;

            double next = parsePower();

            if (op.equals("*"))
                value = Arithmetic.multiply(value, next);
            else
                value = Arithmetic.divide(value, next);
        }

        return value;
    }

    // ==========================
    // ^
    // ==========================

    private double parsePower() {

        double value = parseFactor();

        while (
                position < tokens.size()
                        &&
                        tokens.get(position).equals("^")
        ) {

            position++;

            double exponent = parseFactor();

            value = Math.pow(value, exponent);
        }

        return value;
    }

    // ==========================
    // Numbers
    // Functions
    // Constants
    // Parentheses
    // Unary + -
    // ==========================

    private double parseFactor() {

        if (position >= tokens.size()) {
            throw new RuntimeException("Unexpected end of expression");
        }

        String token = tokens.get(position);

        // --------------------------
        // Unary -
        // --------------------------

        if (token.equals("-")) {

            position++;

            return -parseFactor();

        }

        // --------------------------
        // Unary +
        // --------------------------

        if (token.equals("+")) {

            position++;

            return parseFactor();

        }

        position++;

        // --------------------------
        // Functions
        // --------------------------

        if (FunctionLibrary.exists(token)) {

            if (
                    position >= tokens.size()
                            ||
                            !tokens.get(position).equals("(")
            ) {

                throw new RuntimeException(
                        "Expected '(' after function " + token
                );

            }

            position++;

            List<Double> arguments =
                    parseArguments();

            if (
                    position >= tokens.size()
                            ||
                            !tokens.get(position).equals(")")
            ) {

                throw new RuntimeException(
                        "Missing ')' after function"
                );

            }

            position++;

            return FunctionLibrary.call(
                    token,
                    arguments
            );

        }

        // --------------------------
        // Constants
        // --------------------------

        if (FunctionLibrary.constantExists(token)) {

            return FunctionLibrary.constant(token);

        }

        // --------------------------
        // Parentheses
        // --------------------------

        if (token.equals("(")) {

            double value =
                    parseExpression();

            if (
                    position >= tokens.size()
                            ||
                            !tokens.get(position).equals(")")
            ) {

                throw new RuntimeException(
                        "Missing ')'"
                );

            }

            position++;

            return value;

        }

        // --------------------------
        // Number
        // --------------------------

        return Double.parseDouble(token);

    }

    // ==========================
    // Parse function arguments
    // ==========================

    private List<Double> parseArguments() {

        List<Double> args =
                new ArrayList<>();

        if (
                position < tokens.size()
                        &&
                        tokens.get(position).equals(")")
        ) {

            return args;

        }

        while (true) {

            args.add(
                    parseExpression()
            );

            if (
                    position >= tokens.size()
            ) {

                break;

            }

            if (
                    tokens.get(position).equals(",")
            ) {

                position++;

                continue;

            }

            break;

        }

        return args;

    }
}
