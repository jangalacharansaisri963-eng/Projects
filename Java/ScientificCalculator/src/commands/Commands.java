package commands;

import java.awt.Toolkit;
import java.awt.datatransfer.DataFlavor;
import java.awt.datatransfer.StringSelection;

import state.CalculatorState;

public class Commands {

    public static String preprocess(String expression) {

        expression = expression.trim();

        // ------------------------
        // Ans
        // ------------------------

        if (expression.equalsIgnoreCase("Ans")) {

            return String.valueOf(
                    CalculatorState.getLastAnswer()
            );

        }

        // ------------------------
        // Ans in expressions
        // ------------------------

        expression =
                expression.replaceAll(
                        "(?i)\\bAns\\b",
                        String.valueOf(
                                CalculatorState.getLastAnswer()
                        )
                );

        return expression;

    }


    public static boolean execute(String command) {

        command = command.trim();

        // ------------------------
        // History
        // ------------------------

        if (command.equalsIgnoreCase("history")) {

            System.out.println();

            for (String s : CalculatorState.getHistory()) {

                System.out.println(s);

            }

            return true;

        }


        // ------------------------
        // Clear
        // ------------------------

        if (command.equalsIgnoreCase("clear")) {

            CalculatorState.clear();

            System.out.println("Calculator cleared.");

            return true;

        }


        // ------------------------
        // Copy Ans
        // ------------------------

        if (command.equalsIgnoreCase("copy Ans")) {

            Toolkit.getDefaultToolkit()
                    .getSystemClipboard()
                    .setContents(
                            new StringSelection(
                                    String.valueOf(
                                            CalculatorState.getLastAnswer()
                                    )
                            ),
                            null
                    );

            System.out.println("Copied.");

            return true;

        }


        // ------------------------
        // Paste
        // ------------------------

        if (command.equalsIgnoreCase("paste")) {

            try {

                String value =
                        (String) Toolkit.getDefaultToolkit()
                                .getSystemClipboard()
                                .getData(DataFlavor.stringFlavor);

                System.out.println(value);

            }

            catch (Exception e) {

                System.out.println("Clipboard unavailable.");

            }

            return true;

        }

        return false;

    }

}
