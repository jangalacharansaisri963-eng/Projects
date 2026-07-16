package parser;

import java.util.ArrayList;
import java.util.List;


public class Tokenizer {


    // ==========================
    // Tokenize Expression
    // ==========================

    public static List<String> tokenize(
            String expression
    ) {

        List<String> tokens =
                new ArrayList<>();


        StringBuilder current =
                new StringBuilder();



        for (int i = 0; i < expression.length(); i++) {


            char c =
                    expression.charAt(i);



            // ==========================
            // Numbers / Names
            // ==========================

            if (
                Character.isDigit(c)
                ||
                c == '.'
                ||
                Character.isLetter(c)
            ) {

                current.append(c);
                continue;
            }



            // Finish current token

            if (current.length() > 0) {

                tokens.add(
                    current.toString()
                );

                current.setLength(0);

            }



            // ==========================
            // Spaces
            // ==========================

            if (
                Character.isWhitespace(c)
            ) {

                continue;

            }



            // ==========================
            // Operators + Brackets
            // ==========================

            if (
                c == '+'
                ||
                c == '-'
                ||
                c == '*'
                ||
                c == '/'
                ||
                c == '('
                ||
                c == ')'
            ) {

                tokens.add(
                    String.valueOf(c)
                );

            }

            else {

                throw new RuntimeException(
                    "Unknown character: " + c
                );

            }

        }



        if (current.length() > 0) {

            tokens.add(
                current.toString()
            );

        }



        return tokens;

    }

}
