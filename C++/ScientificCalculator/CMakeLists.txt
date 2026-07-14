cmake_minimum_required(VERSION 3.16)

project(ScientificCalculator)


set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)


add_executable(
    ScientificCalculator

    src/main.cpp

    src/Constants.h

    src/MathLibrary.cpp
    src/MathLibrary.h

    src/Tokenizer.cpp
    src/Tokenizer.h

    src/Parser.cpp
    src/Parser.h
)
