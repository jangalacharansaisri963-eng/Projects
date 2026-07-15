#ifndef TOKENIZER_H
#define TOKENIZER_H

#include <string>
#include <vector>


class Tokenizer
{

private:

    std::string expression;

public:

    Tokenizer(
        const std::string& expression
    );

    std::vector<std::string> tokenize();

};

#endif
