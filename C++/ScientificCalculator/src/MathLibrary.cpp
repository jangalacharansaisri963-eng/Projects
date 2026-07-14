#include "MathLibrary.h"
#include "Constants.h"

#include <cmath>
#include <stdexcept>


using namespace std;


// =======================
// Math Library Storage
// =======================

map<string, MathFunction> MATH_LIB;



// =======================
// Initialize Functions
// =======================

void initializeMathLibrary()
{

    MATH_LIB.clear();



    MATH_LIB["sqrt"] =
    [](vector<double> args)
    {

        if(args.size() != 1)
            throw runtime_error(
                "sqrt requires 1 argument"
            );


        return sqrt(args[0]);

    };



    MATH_LIB["cbrt"] =
    [](vector<double> args)
    {

        if(args.size() != 1)
            throw runtime_error(
                "cbrt requires 1 argument"
            );


        return cbrt(args[0]);

    };



    MATH_LIB["root"] =
    [](vector<double> args)
    {

        if(args.size() != 2)
            throw runtime_error(
                "root requires index,value"
            );


        return pow(
            args[1],
            1.0 / args[0]
        );

    };



    MATH_LIB["sin"] =
    [](vector<double> args)
    {
        return sin(args[0]);
    };


    MATH_LIB["cos"] =
    [](vector<double> args)
    {
        return cos(args[0]);
    };


    MATH_LIB["tan"] =
    [](vector<double> args)
    {
        return tan(args[0]);
    };



    MATH_LIB["sinh"] =
    [](vector<double> args)
    {
        return sinh(args[0]);
    };


    MATH_LIB["cosh"] =
    [](vector<double> args)
    {
        return cosh(args[0]);
    };


    MATH_LIB["tanh"] =
    [](vector<double> args)
    {
        return tanh(args[0]);
    };



    MATH_LIB["ln"] =
    [](vector<double> args)
    {
        return log(args[0]);
    };



    MATH_LIB["lg"] =
    [](vector<double> args)
    {
        return log10(args[0]);
    };



    MATH_LIB["factorial"] =
    [](vector<double> args)
    {

        if(args.size() != 1)
            throw runtime_error(
                "factorial requires 1 argument"
            );


        if(args[0] < 0)
            throw runtime_error(
                "Invalid factorial"
            );


        double result = 1;


        for(int i = 1; i <= (int)args[0]; i++)
        {
            result *= i;
        }


        return result;

    };



    MATH_LIB["pi"] =
    [](vector<double>)
    {
        return PI;
    };



    MATH_LIB["e"] =
    [](vector<double>)
    {
        return E;
    };

}
