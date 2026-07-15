#ifndef RANDOM_H
#define RANDOM_H

#include "../Types.h"

class Random
{

public:

    static void registerFunctions();

    static double random(
        const MathArguments& arguments
    );

};

#endif
