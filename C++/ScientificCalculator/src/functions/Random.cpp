#include "Random.h"

#include "../FunctionLibrary.h"

#include <random>
#include <stdexcept>

using namespace std;



void Random::registerFunctions()
{

    FunctionLibrary::registerFunction(
        "rand",
        Random::random
    );

}



double Random::random(
    const MathArguments& arguments
)
{

    if(!arguments.empty())
        throw runtime_error(
            "rand takes no arguments"
        );


    static random_device device;

    static mt19937 generator(
        device()
    );

    static uniform_real_distribution<double>
        distribution(
            0.0,
            1.0
        );


    return distribution(
        generator
    );

}
