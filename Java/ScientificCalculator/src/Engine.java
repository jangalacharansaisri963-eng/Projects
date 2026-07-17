import java.util.List;

import parser.Tokenizer;
import parser.Parser;


public class Engine {


    // ==========================
    // Evaluate Expression
    // ==========================

    public static double evaluate(
            String expression
    ) {


        if (
            expression == null
            ||
            expression.trim().isEmpty()
        ) {

            throw new IllegalArgumentException(
                "Expression is empty"
            );

        }



        try {


            List<String> tokens =
                    Tokenizer.tokenize(
                        expression
                    );



            Parser parser =
                    new Parser(
                        tokens
                    );



            return parser.parse();


        }


        catch (NumberFormatException e) {


            throw new IllegalArgumentException(
                "Invalid number format"
            );


        }


        catch (IndexOutOfBoundsException e) {


            throw new IllegalArgumentException(
                "Incomplete expression"
            );


        }

    }

}
