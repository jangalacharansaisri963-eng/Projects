#include "Tokenizer.h"

#include <cctype>
#include <stdexcept>

using namespace std;



// =======================
// Constructor
// =======================

Tokenizer::Tokenizer(
    const string& expression
)
{
    this->expression =
        expression;
}



// =======================
// Tokenize
// =======================

vector<string>
Tokenizer::tokenize()
{

    vector<string> tokens;


    for(
        size_t i = 0;
        i < expression.length();
    )
    {

        char c =
            expression[i];


        // =======================
        // Ignore spaces
        // =======================

        if(
            isspace(
                static_cast<unsigned char>(c)
            )
        )
        {

            i++;

            continue;

        }



        // =======================
        // Number
        // =======================

        if(
            isdigit(
                static_cast<unsigned char>(c)
            ) ||
            c == '.'
        )
        {

            string number;


            while(
                i < expression.length() &&
                (
                    isdigit(
                        static_cast<unsigned char>(
                            expression[i]
                        )
                    ) ||
                    expression[i] == '.'
                )
            )
            {

                number +=
                    expression[i];

                i++;

            }


            tokens.push_back(
                number
            );

            continue;

        }



        // =======================
        // Identifier
        // =======================

        if(
            isalpha(
                static_cast<unsigned char>(c)
            ) ||
            c == '_'
        )
        {

            string identifier;


            while(
                i < expression.length() &&
                (
                    isalnum(
                        static_cast<unsigned char>(
                            expression[i]
                        )
                    ) ||
                    expression[i] == '_'
                )
            )
            {

                identifier +=
                    expression[i];

                i++;

            }


            tokens.push_back(
                identifier
            );

            continue;

        }



        // =======================
        // Operators
        // =======================

        switch(c)
        {

            case '+':
            case '-':
            case '*':
            case '/':
            case '%':
            case '^':
            case '(':
            case ')':
            case ',':

                tokens.push_back(
                    string(
                        1,
                        c
                    )
                );

                i++;

                break;



            default:

                throw runtime_error(
                    string(
                        "Unknown character: "
                    ) + c
                );

        }

    }


    return tokens;

}
