package parser;

import java.util.ArrayList;
import java.util.List;

/*
 * EquationTokenizer
 *
 * Converts an equation string into tokens.
 *
 * Example:
 *
 * 2x+4=10
 *
 * becomes:
 *
 * 2 * x + 4 = 10
 *
 */

public class EquationTokenizer {

    // ==========================
    // Tokenize
    // ==========================

    public static List<String> tokenize(String expression) {

        List<String> tokens = new ArrayList<>();

        expression = expression.replace(" ", "");

        for (int i = 0; i < expression.length(); i++) {

            char current = expression.charAt(i);

            // ==========================
            // Numbers
            // ==========================

            if (Character.isDigit(current) || current == '.') {

                StringBuilder number = new StringBuilder();

                while (
                        i < expression.length()
                                &&
                                (
                                        Character.isDigit(expression.charAt(i))
                                                || expression.charAt(i) == '.'
                                )
                ) {

                    number.append(expression.charAt(i));
                    i++;

                }

                i--;

                addToken(tokens, number.toString());
                continue;

            }

            // ==========================
            // Variable
            // ==========================

            if (Character.isLetter(current)) {

                addToken(tokens, String.valueOf(current));
                continue;

            }

            // ==========================
            // Operators / Parentheses
            // ==========================

            if (
                    current == '+'
                            || current == '-'
                            || current == '*'
                            || current == '/'
                            || current == '^'
                            || current == '='
                            || current == '('
                            || current == ')'
                            || current == ','
            ) {

                addToken(tokens, String.valueOf(current));
                continue;

            }

            throw new IllegalArgumentException(
                    "Invalid character: " + current
            );

        }

        return addImplicitMultiplication(tokens);

    }

    // ==========================
    // Add token helper
    // ==========================

    private static void addToken(
            List<String> tokens,
            String token
    ) {

        tokens.add(token);

    }

    // ==========================
    // Implicit multiplication
    // ==========================

    private static List<String> addImplicitMultiplication(
            List<String> tokens
    ) {

        List<String> result = new ArrayList<>();

        for (int i = 0; i < tokens.size(); i++) {

            String current = tokens.get(i);

            result.add(current);

            if (i + 1 < tokens.size()) {

                String next = tokens.get(i + 1);

                if (needsMultiplication(current, next)) {

                    result.add("*");

                }

            }

        }

        return result;

    }

    // ==========================
    // Check multiplication
    // ==========================

    private static boolean needsMultiplication(
            String a,
            String b
    ) {

        boolean left =
                isNumber(a)
                        || a.equals("x")
                        || a.equals(")");

        boolean right =
                isNumber(b)
                        || b.equals("x")
                        || b.equals("(");

        return left && right;

    }

    // ==========================
    // Number check
    // ==========================

    private static boolean isNumber(
            String value
    ) {

        try {

            Double.parseDouble(value);
            return true;

        } catch (Exception e) {

            return false;

        }

    }

}
