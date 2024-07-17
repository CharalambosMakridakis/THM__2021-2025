//
// Created by Nikos on 27.10.2022.
//

#ifndef KSP_STACK_H
#define KSP_STACK_H
#include <stdbool.h>


typedef struct ObjRef {
    unsigned int size; // # byte of payload
    unsigned char data[1]; // payload data, size as needed!
} *ObjRef;

typedef struct {
    bool isObjRef;
    union {
        ObjRef objRef; // isObjRef = TRUE
        int number; // isObjRef = FALSE
    } u;
} StackSlot;

void execute_program(int gcpurge, int gcstats);
void execute_debug_program(void);
extern int* program_memory;
extern ObjRef rvr;
extern ObjRef* static_data_area;
extern int number_of_instructions;
extern long stack_size;
extern StackSlot* stack;
extern int sp;

#endif //KSP_STACK_H
