#ifndef ENGINE_H
#define ENGINE_H

#include <string>


// =======================
// Engine
// =======================
//
// Coordinates the calculator.
//
// Responsibilities:
//
// • Initialize the FunctionLibrary
// • Tokenize expressions
// • Parse expressions
// • Return the final result
//
// It does NOT:
//
// • Perform parsing
// • Perform mathematical operations
// • Know how sqrt(), sin(), etc. work
//
// =======================

class Engine
{

public:

    // Initialize calculator
    static void initialize();


    // Evaluate an expression
    static double evaluate(
        const std::string& expression
    );

};

#endif
