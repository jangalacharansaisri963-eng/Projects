#include "Roots.h"

#include "../FunctionLibrary.h"

#include <cmath>
#include <stdexcept>

using namespace std;



void Roots::registerFunctions()
{

    FunctionLibrary::registerFunction(
        "sqrt",
        Roots::sqrt
    );

    FunctionLibrary::registerFunction(
        "cbrt",
        Roots::cbrt
    );

    FunctionLibrary::registerFunction(
        "root",
        Roots::root
    );

}



double Roots::sqrt(
    const MathArguments& arguments
)
{

    if(arguments.size() != 1)
        throw runtime_error(
            "sqrt requires 1 argument"
        );

    return std::sqrt(
        arguments[0]
    );

}



double Roots::cbrt(
    const MathArguments& arguments
)
{

    if(arguments.size() != 1)
        throw runtime_error(
            "cbrt requires 1 argument"
        );

    return std::cbrt(
        arguments[0]
    );

}



double Roots::root(
    const MathArguments& arguments
)
{

    if(arguments.size() != 2)
        throw runtime_error(
            "root requires 2 arguments"
        );

    return std::pow(
        arguments[1],
        1.0 / arguments[0]
    );

}
