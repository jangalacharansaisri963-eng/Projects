import java.util.Scanner;


public class Main {


    public static void main(
            String[] args
    ) {


        Scanner scanner =
                new Scanner(
                    System.in
                );


        System.out.println(
            "Scientific Calculator Java"
        );

        System.out.println(
            "Type exit to quit\n"
        );


        while (true) {


            System.out.print(
                "> "
            );


            String expression =
                    scanner.nextLine();



            if (
                expression.equalsIgnoreCase("exit")
                ||
                expression.equalsIgnoreCase("quit")
            ) {

                break;

            }



            if (
                expression.trim().isEmpty()
            ) {

                continue;

            }



            try {


                double result =
                        Engine.evaluate(
                            expression
                        );


                System.out.println(
                    "= " + result
                );


            }


            catch (Exception e) {


                System.out.println(
                    "Error: "
                    + e.getMessage()
                );

            }

        }


        scanner.close();

    }

}
