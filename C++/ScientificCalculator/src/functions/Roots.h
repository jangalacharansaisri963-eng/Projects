#ifndef ROOTS_H
#define ROOTS_H

#include "../Types.h"

class Roots
{

public:

    static void registerFunctions();

    static double sqrt(
        const MathArguments& arguments
    );

    static double cbrt(
        const MathArguments& arguments
    );

    static double root(
        const MathArguments& arguments
    );

};

#endif
