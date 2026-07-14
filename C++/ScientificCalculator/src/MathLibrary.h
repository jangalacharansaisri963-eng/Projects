#ifndef MATHLIBRARY_H
#define MATHLIBRARY_H

#include <string>
#include <vector>
#include <map>
#include <functional>


// Function type:
// Allows both single and multi argument functions

using MathFunction =
    function<double(vector<double>)>;



extern map<string, MathFunction> MATH_LIB;



void initializeMathLibrary();


#endif
