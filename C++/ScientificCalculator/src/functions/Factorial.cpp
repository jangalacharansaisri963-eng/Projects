#include "Factorial.h"

#include "../FunctionLibrary.h"

#include <cmath>
#include <stdexcept>

using namespace std;



void Factorial::registerFunctions()
{

    FunctionLibrary::registerFunction(
        "factorial",
        Factorial::factorial
    );

}



double Factorial::factorial(
    const MathArguments& arguments
)
{

    if(arguments.size() != 1)
        throw runtime_error(
            "factorial requires 1 argument"
        );

    double value =
        arguments[0];

    if(value < 0)
        throw runtime_error(
            "factorial undefined for negative numbers"
        );

    if(floor(value) != value)
        throw runtime_error(
            "factorial requires an integer"
        );

    double result = 1.0;

    for(
        int i = 2;
        i <= static_cast<int>(value);
        i++
    )
    {
        result *= i;
    }

    return result;

}
