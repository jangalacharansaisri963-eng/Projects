#ifndef TYPES_H
#define TYPES_H

#include <functional>
#include <map>
#include <string>
#include <vector>


// =======================
// Common Types
// =======================

using MathArguments =
    std::vector<double>;


using MathFunction =
    std::function<
        double(
            const MathArguments&
        )
    >;


using FunctionMap =
    std::map<
        std::string,
        MathFunction
    >;

#endif
