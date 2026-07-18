import java.util.Scanner;

import library.FunctionLibrary;
import commands.Commands;
import state.CalculatorState;

public class Main {


    public static void main(
            String[] args
    ) {


        // Load calculator functions/constants

        FunctionLibrary.initialize();



        Scanner scanner =
                new Scanner(
                    System.in
                );



        System.out.println(
            "Scientific Calculator Java"
        );

        System.out.println(
            "Type exit or quit to close"
        );

        System.out.println();



        while (true) {


            System.out.print(
                "> "
            );


            String expression =
        scanner.nextLine()
               .trim();

if (Commands.execute(expression)) {
    System.out.println();
    continue;
}

expression = Commands.preprocess(expression);



            if (
                expression.equalsIgnoreCase("exit")
                ||
                expression.equalsIgnoreCase("quit")
            ) {

                System.out.println(
                    "Goodbye!"
                );

                break;

            }



            if (
                expression.isEmpty()
            ) {

                continue;

            }



            try {


                double result =
        Engine.evaluate(
            expression
        );

CalculatorState.setLastAnswer(result);

CalculatorState.addHistory(
        expression + " = " + result
);

System.out.println(
    "= " + result
);


            }


            catch (Exception e) {


                String message =
                        e.getMessage();



                if (message == null) {

                    message =
                        "Invalid expression";

                }



                System.out.println(
                    "Error: "
                    + message
                );

            }


            System.out.println();

        }



        scanner.close();

    }

}
