#ifndef POWERS_H
#define POWERS_H

#include "../Types.h"

class Powers
{

public:

    static void registerFunctions();

    static double square(
        const MathArguments& arguments
    );

    static double cube(
        const MathArguments& arguments
    );

    static double power(
        const MathArguments& arguments
    );

    static double tenPower(
        const MathArguments& arguments
    );

    static double ePower(
        const MathArguments& arguments
    );

};

#endif
