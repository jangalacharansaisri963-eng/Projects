#include "Memory.h"

#include "../FunctionLibrary.h"

#include <stdexcept>

using namespace std;



double Memory::memory = 0.0;



void Memory::registerFunctions()
{

    FunctionLibrary::registerFunction(
        "mr",
        Memory::mr
    );

    FunctionLibrary::registerFunction(
        "mc",
        Memory::mc
    );

    FunctionLibrary::registerFunction(
        "mplus",
        Memory::mplus
    );

    FunctionLibrary::registerFunction(
        "mminus",
        Memory::mminus
    );

}



double Memory::mr(
    const MathArguments& arguments
)
{

    if(!arguments.empty())
        throw runtime_error(
            "mr takes no arguments"
        );

    return memory;

}



double Memory::mc(
    const MathArguments& arguments
)
{

    if(!arguments.empty())
        throw runtime_error(
            "mc takes no arguments"
        );

    memory = 0.0;

    return memory;

}



double Memory::mplus(
    const MathArguments& arguments
)
{

    if(arguments.size() != 1)
        throw runtime_error(
            "mplus requires 1 argument"
        );

    memory += arguments[0];

    return memory;

}



double Memory::mminus(
    const MathArguments& arguments
)
{

    if(arguments.size() != 1)
        throw runtime_error(
            "mminus requires 1 argument"
        );

    memory -= arguments[0];

    return memory;

}
