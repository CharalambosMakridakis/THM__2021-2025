cmake_minimum_required(VERSION 3.23)
project(KSP C)

set(CMAKE_C_STANDARD 11)

include_directories(.)

add_executable(KSP
        main.c
        opCodes.h
        stack.c
        stack.h programLoader.c programLoader.h globals.h gc.c gc.h)
