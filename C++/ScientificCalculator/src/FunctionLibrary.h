#ifndef FUNCTIONLIBRARY_H
#define FUNCTIONLIBRARY_H

#include "Types.h"

#include <string>


// =======================
// Function Library
// =======================

class FunctionLibrary
{

public:

    // Register a function
    static void registerFunction(
        const std::string& name,
        MathFunction function
    );


    // Check if a function exists
    static bool exists(
        const std::string& name
    );


    // Execute a function
    static double call(
        const std::string& name,
        const MathArguments& arguments
    );


    // Register every built-in function
    static void initialize();


private:

    static FunctionMap FUNCTIONS;

};

#endif
