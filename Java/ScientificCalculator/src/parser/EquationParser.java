package parser;

import java.util.List;


/*
 * EquationParser
 *
 * Converts tokens into LinearExpression.
 *
 * Supports:
 *
 * 2x+4
 * 5(x-2)
 * 3(x+1)-5
 *
 */

public class EquationParser {


    private List<String> tokens;
    private int position;



    // ==========================
    // Constructor
    // ==========================

    public EquationParser(
            List<String> tokens
    ) {

        this.tokens = tokens;
        this.position = 0;

    }



    // ==========================
    // Parse expression
    // ==========================

    public LinearExpression parse() {

        position = 0;

        return expression();

    }



    // ==========================
    // expression
    //
    // Handles + and -
    // ==========================

    private LinearExpression expression() {


        LinearExpression result =
                term();


        while (position < tokens.size()) {


            String token =
                    tokens.get(position);



            if (token.equals("+")) {

                position++;

                result =
                    result.add(
                        term()
                    );

            }


            else if (token.equals("-")) {

                position++;

                result =
                    result.subtract(
                        term()
                    );

            }


            else {

                break;

            }

        }


        return result;

    }



    // ==========================
    // term
    //
    // Handles *
    // ==========================

    private LinearExpression term() {


        LinearExpression result =
                factor();



        while (
                position < tokens.size()
                &&
                tokens.get(position)
                        .equals("*")
        ) {


            position++;


            LinearExpression next =
                    factor();



            /*
             * Linear × Linear would create
             * x², which is not first degree.
             */

            if (
                result.hasVariable()
                &&
                next.hasVariable()
            ) {

                throw new IllegalArgumentException(
                    "Not a first degree equation"
                );

            }


            if (result.hasVariable()) {

                result =
                    result.multiply(
                        next.getConstant()
                    );

            }


            else if (next.hasVariable()) {

                result =
                    next.multiply(
                        result.getConstant()
                    );

            }


            else {

                result =
                    new LinearExpression(
                        0,
                        result.getConstant()
                        *
                        next.getConstant()
                    );

            }

        }


        return result;

    }



    // ==========================
    // factor
    // ==========================

    private LinearExpression factor() {


        String token =
                tokens.get(position);



        // Parentheses

        if (token.equals("(")) {


            position++;


            LinearExpression inside =
                    expression();



            if (
                position >= tokens.size()
                ||
                !tokens.get(position)
                    .equals(")")
            ) {

                throw new IllegalArgumentException(
                    "Missing closing parenthesis"
                );

            }


            position++;


            return inside;

        }



        // Variable

        if (token.equals("x")) {


            position++;


            return new LinearExpression(
                    1,
                    0
            );

        }



        // Number

        try {


            double value =
                    Double.parseDouble(token);


            position++;


            return new LinearExpression(
                    0,
                    value
            );


        }

        catch (Exception e) {


            throw new IllegalArgumentException(
                "Invalid token: "
                + token
            );

        }

    }

}
