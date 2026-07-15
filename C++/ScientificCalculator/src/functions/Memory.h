#ifndef MEMORY_H
#define MEMORY_H

#include "../Types.h"

class Memory
{

public:

    static void registerFunctions();

    static double mr(
        const MathArguments& arguments
    );

    static double mc(
        const MathArguments& arguments
    );

    static double mplus(
        const MathArguments& arguments
    );

    static double mminus(
        const MathArguments& arguments
    );

private:

    static double memory;

};

#endif
