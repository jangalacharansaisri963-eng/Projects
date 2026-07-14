#include <iostream>

using namespace std;


int main()
{
    double a;
    double b;
    char operation;


    cout << "========================\n";
    cout << " Basic C++ Calculator\n";
    cout << "========================\n\n";


    while (true)
    {
        cout << "\nEnter first number: ";
        cin >> a;


        cout << "Operation (+ - * /) or q to quit: ";
        cin >> operation;


        if (operation == 'q')
        {
            cout << "Goodbye!\n";
            break;
        }


        cout << "Enter second number: ";
        cin >> b;


        double result;


        switch (operation)
        {
            case '+':
                result = a + b;
                break;


            case '-':
                result = a - b;
                break;


            case '*':
                result = a * b;
                break;


            case '/':
                if (b == 0)
                {
                    cout << "Error: Division by zero.\n";
                    continue;
                }

                result = a / b;
                break;


            default:
                cout << "Invalid operation.\n";
                continue;
        }


        cout << "Result = " << result << "\n";
    }


    return 0;
}
