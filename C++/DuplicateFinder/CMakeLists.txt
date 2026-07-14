cmake_minimum_required(VERSION 3.16)

project(DuplicateFinder)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt6 REQUIRED COMPONENTS Widgets)

add_executable(
    DuplicateFinder

    src/main.cpp
    src/MainWindow.cpp
    src/MainWindow.h
    src/Scanner.cpp
    src/Scanner.h
    src/DuplicateChecker.cpp
    src/DuplicateChecker.h
)

target_link_libraries(
    DuplicateFinder
    Qt6::Widgets
)
