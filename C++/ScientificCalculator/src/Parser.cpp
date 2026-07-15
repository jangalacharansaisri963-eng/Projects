#include "Parser.h"

#include "MathLibrary.h"
#include "Constants.h"

#include <cmath>
#include <stdexcept>
#include <cctype>


using namespace std;



Parser::Parser(
    vector<string> t
)
{
    tokens = t;
}



// =======================
// Entry
// =======================

double Parser::evaluate()
{

    if(tokens.empty())
        throw runtime_error(
            "Empty expression"
        );


    double result =
        parseExpression();


    if(position != tokens.size())
        throw runtime_error(
            "Unexpected token: " +
            tokens[position]
        );


    return result;

}



// =======================
// + -
// =======================

double Parser::parseExpression()
{

    double value =
        parseTerm();



    while(
        position < tokens.size()
    )
    {

        string op =
            tokens[position];


        if(
            op != "+" &&
            op != "-"
        )
            break;


        position++;


        double next =
            parseTerm();



        if(op == "+")
            value += next;

        else
            value -= next;

    }


    return value;

}



// =======================
// * / %
// =======================

double Parser::parseTerm()
{

    double value =
        parsePower();



    while(
        position < tokens.size()
    )
    {

        string op =
            tokens[position];


        if(
            op != "*" &&
            op != "/" &&
            op != "%"
        )
            break;


        position++;


        double next =
            parsePower();



        if(op == "*")
            value *= next;


        else if(op == "/")
        {

            if(next == 0)
                throw runtime_error(
                    "Division by zero"
                );


            value /= next;

        }


        else
        {

            value =
                fmod(
                    value,
                    next
                );

        }

    }


    return value;

}



// =======================
// Power
// =======================

double Parser::parsePower()
{

    double value =
        parseUnary();



    while(
        position < tokens.size() &&
        tokens[position] == "^"
    )
    {

        position++;


        double exponent =
            parseUnary();



        value =
            pow(
                value,
                exponent
            );

    }


    return value;

}



// =======================
// Unary + and -
// =======================

double Parser::parseUnary()
{

    if(
        position < tokens.size()
    )
    {

        if(tokens[position] == "-")
        {

            position++;

            return -parseUnary();

        }


        if(tokens[position] == "+")
        {

            position++;

            return parseUnary();

        }

    }


    return parsePrimary();

}

// =======================
// Primary
// =======================

double Parser::parsePrimary()
{

    if(position >= tokens.size())
        throw runtime_error(
            "Unexpected end"
        );



    string token =
        tokens[position++];



    // =======================
    // Parentheses
    // =======================

    if(token == "(")
    {

        double value =
            parseExpression();



        if(
            position >= tokens.size() ||
            tokens[position] != ")"
        )
        {
            throw runtime_error(
                "Missing )"
            );
        }



        position++;


        return value;

    }



    // =======================
    // Number
    // =======================

    if(
        isdigit(token[0]) ||
        token[0] == '.'
    )
    {

        return stod(token);

    }



    // =======================
    // Constants
    // =======================

    if(token == "pi")
        return PI;


    if(token == "e")
        return E;



    // =======================
    // Functions
    // =======================

    if(
        MATH_LIB.count(token)
    )
    {

        if(
            position >= tokens.size() ||
            tokens[position] != "("
        )
        {
            throw runtime_error(
                "Expected ( after function"
            );
        }



        position++;



        vector<double> args;



        // Empty function call check

        if(
            position < tokens.size() &&
            tokens[position] != ")"
        )
        {

            while(true)
            {

                args.push_back(
                    parseExpression()
                );



                if(
                    position < tokens.size() &&
                    tokens[position] == ","
                )
                {

                    position++;

                    continue;

                }


                break;

            }

        }



        if(
            position >= tokens.size() ||
            tokens[position] != ")"
        )
        {
            throw runtime_error(
                "Missing ) after function"
            );
        }



        position++;



        return MATH_LIB[token](args);

    }



    throw runtime_error(
        "Unknown token: " + token
    );

}
