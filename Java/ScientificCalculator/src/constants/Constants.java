package constants;

public class Constants {

    // ==========================
    // Mathematical Constants
    // ==========================

    public static final double PI =
            Math.PI;

    public static final double E =
            Math.E;

    public static final double PHI =
            (1.0 + Math.sqrt(5.0)) / 2.0;

    /*
     * Rishon's Constant (R15)
     *
     * R15 = Σ 1 / n^(n+1)
     */

    public static final double R15 =
            calculateR15();

    // ==========================
    // Calculate R15
    // ==========================

    private static double calculateR15() {

        double sum = 0.0;

        for (int n = 1; n <= 30; n++) {

            sum +=
                    1.0 /
                    Math.pow(
                            n,
                            n + 1
                    );

        }

        return sum;

    }

}
