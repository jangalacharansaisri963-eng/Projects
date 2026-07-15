#ifndef CONSTANTS_H
#define CONSTANTS_H

#include <cmath>
#include <string>


// =======================
// Mathematical Constants
// =======================

namespace Constants
{

    inline constexpr double PI =
        3.141592653589793238462643383279502884;

    inline constexpr double E =
        2.718281828459045235360287471352662498;

}


// =======================
// Calculator Settings
// =======================

namespace Settings
{

    inline constexpr int DEFAULT_PRECISION = 15;

    inline constexpr int MAX_PRECISION = 50;

}


// =======================
// Angle Mode
// =======================

enum class AngleMode
{
    Radians,
    Degrees
};

#endif
