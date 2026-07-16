package parser;

import java.util.List;

import functions.Arithmetic;
import library.FunctionLibrary;


public class Parser {


    private final List<String> tokens;

    private int position = 0;



    public Parser(
            List<String> tokens
    ) {

        this.tokens = tokens;

    }



    // ==========================
    // Entry Point
    // ==========================

    public double parse() {

        double result =
                parseExpression();


        if (position != tokens.size()) {

            throw new RuntimeException(
                "Unexpected token: "
                + tokens.get(position)
            );
        }


        return result;
    }



    // ==========================
    // + -
    // ==========================

    private double parseExpression() {

        double value =
                parseTerm();


        while (position < tokens.size()) {

            String operator =
                    tokens.get(position);


            if (
                !operator.equals("+")
                &&
                !operator.equals("-")
            ) {
                break;
            }


            position++;


            double next =
                    parseTerm();


            if (operator.equals("+")) {

                value =
                    Arithmetic.add(
                        value,
                        next
                    );

            }

            else {

                value =
                    Arithmetic.subtract(
                        value,
                        next
                    );

            }

        }


        return value;
    }



    // ==========================
    // * /
    // ==========================

    private double parseTerm() {

        double value =
                parseFactor();



        while (position < tokens.size()) {


            String operator =
                    tokens.get(position);



            if (
                !operator.equals("*")
                &&
                !operator.equals("/")
            ) {

                break;
            }



            position++;


            double next =
                    parseFactor();



            if (operator.equals("*")) {

                value =
                    Arithmetic.multiply(
                        value,
                        next
                    );

            }

            else {

                value =
                    Arithmetic.divide(
                        value,
                        next
                    );

            }

        }


        return value;
    }



    // ==========================
// Numbers + Brackets + Functions
// ==========================

private double parseFactor() {


    String token =
            tokens.get(position++);



    // ==========================
    // Function
    // ==========================

    if (
        FunctionLibrary.exists(token)
    ) {


        if (
            position >= tokens.size()
            ||
            !tokens.get(position).equals("(")
        ) {

            throw new RuntimeException(
                "Expected ( after function"
            );

        }


        position++;


        double argument =
                parseExpression();



        if (
            position >= tokens.size()
            ||
            !tokens.get(position).equals(")")
        ) {

            throw new RuntimeException(
                "Missing ) after function"
            );

        }


        position++;


        return FunctionLibrary.call(
            token,
            argument
        );

    }




    // ==========================
    // Brackets
    // ==========================

    if (
        token.equals("(")
    ) {


        double value =
                parseExpression();



        if (
            position >= tokens.size()
            ||
            !tokens.get(position).equals(")")
        ) {

            throw new RuntimeException(
                "Missing )"
            );

        }


        position++;


        return value;

    }



    // ==========================
    // Number
    // ==========================

    return Double.parseDouble(token);

}

}
