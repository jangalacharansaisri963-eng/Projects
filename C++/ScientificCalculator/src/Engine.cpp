#include "Engine.h"

#include "FunctionLibrary.h"
#include "Tokenizer.h"
#include "Parser.h"

#include <vector>
#include <string>


using namespace std;



// =======================
// Initialize
// =======================

void Engine::initialize()
{

    static bool initialized =
        false;


    if(initialized)
        return;


    FunctionLibrary::initialize();


    initialized = true;

}



// =======================
// Evaluate
// =======================

double Engine::evaluate(
    const string& expression
)
{

    initialize();


    vector<string> tokens =
        tokenize(
            expression
        );


    Parser parser(
        tokens
    );


    return parser.evaluate();

}
