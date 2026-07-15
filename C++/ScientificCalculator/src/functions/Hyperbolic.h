#ifndef HYPERBOLIC_H
#define HYPERBOLIC_H

#include "../Types.h"

class Hyperbolic
{

public:

    static void registerFunctions();

    static double sinh(
        const MathArguments& arguments
    );

    static double cosh(
        const MathArguments& arguments
    );

    static double tanh(
        const MathArguments& arguments
    );

};

#endif
