#include "Arithmetic.h"

#include "../FunctionLibrary.h"

#include <cmath>
#include <stdexcept>

using namespace std;



void Arithmetic::registerFunctions()
{

    FunctionLibrary::registerFunction(
        "abs",
        Arithmetic::abs
    );

    FunctionLibrary::registerFunction(
        "reciprocal",
        Arithmetic::reciprocal
    );

    FunctionLibrary::registerFunction(
        "negate",
        Arithmetic::negate
    );

}



double Arithmetic::abs(
    const MathArguments& arguments
)
{

    if(arguments.size() != 1)
        throw runtime_error(
            "abs requires 1 argument"
        );

    return std::fabs(
        arguments[0]
    );

}



double Arithmetic::reciprocal(
    const MathArguments& arguments
)
{

    if(arguments.size() != 1)
        throw runtime_error(
            "reciprocal requires 1 argument"
        );

    if(arguments[0] == 0)
        throw runtime_error(
            "Division by zero"
        );

    return 1.0 / arguments[0];

}



double Arithmetic::negate(
    const MathArguments& arguments
)
{

    if(arguments.size() != 1)
        throw runtime_error(
            "negate requires 1 argument"
        );

    return -arguments[0];

}
