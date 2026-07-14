#ifndef PARSER_H
#define PARSER_H

#include <string>
#include <vector>


using namespace std;


class Parser
{

private:

    vector<string> tokens;

    size_t position = 0;



    double parseExpression();

    double parseTerm();

    double parsePower();

    double parseUnary();

    double parsePrimary();



public:

    Parser(
        vector<string> t
    );


    double evaluate();

};



#endif
