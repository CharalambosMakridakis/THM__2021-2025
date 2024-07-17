#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "opCodes.h"
#include "programLoader.h"
#include "stack.h"
#include "bigint/build/include/support.h"
#include "bigint/build/include/bigint.h"
#include "gc.h"

void* getPrimObjectDataPointer(void * obj){
    ObjRef oo = ((ObjRef) (obj));
    return oo->data;
}

void* newPrimObject(int dataSize){
    ObjRef objRef;
    //objRef = (ObjRef) alloc_heap(sizeof(unsigned int) + dataSize * sizeof(unsigned char));
    objRef = (ObjRef) alloc_heap(sizeof(struct ObjRef) + dataSize);
    if((void*) objRef == NULL) perror("newPrimObject: alloc_heap");
    objRef->size = (unsigned int) dataSize;
    return objRef;
}

void fatalError(char* msg){
    printf("%s\n", msg);
    exit(1);
}

#define TRUE 1
#define FALSE 0
int sp = 0;           // the stack-pointer
int pc = -1;           // the program-counter
int fp = 0;          // frame-pointer
ObjRef rvr = NULL;          // return value register
StackSlot *stack;
int *program_memory;
ObjRef *static_data_area;
int number_of_instructions;
long stack_size = 64;


void push_stack(StackSlot x) {
    stack[sp] = x;
    sp++;
}

StackSlot pop_stack(void) {
    if(sp <= 0) {
        perror("ERROR - pop_stack() : stack empty");
        exit(1);
    }
    sp--;
    StackSlot tmp = stack[sp];
    stack[sp].u.objRef = NULL;
    stack[sp].u.number = 0;
    return tmp;
}


void print_stack(void) { // Für Debugger noch umändern
    printf("\n Stack\n");
    printf(".-------+--------.\n");
    for (int i = sp; i >= 0; i--) {
        if (i == sp)
            printf("|sp->%3d| <empty>|\n", i);
        else
            printf("|%7d| %5p |\n", i, stack[i].u.objRef);
    }
    printf("'-------+--------'\n\n");
}

void print_static_data_area(void) { // Für Debugger noch umändern
    printf("\n Static Data Area\n");
    printf("  index | value\n");
    printf(".-------+--------.\n");
    for (int i = 0; i < file_number_of_variables; i++){
        printf("%i\t| \t%p\n", i, static_data_area[i]);
    }
    printf("'-------+--------'\n");
    printf("\n");
}

void print_program_memory(void) {
    printf("\n Program Memory\n");
    printf(" Opcode | Immediate\n");
    printf(".-------+--------.\n");
    for(int i = 0; i < number_of_instructions; i++) {

        printf("%i\t| \t%i\n", program_memory[i] >> 24, SIGN_EXTEND(program_memory[i] & 0x00FFFFFF));
    }
    printf("'-------+--------'\n");
    printf("\n");
}

void jump(int target){
    if(target > 0 && target < number_of_instructions){
        pc = target - 1;
    }else {
        perror("ERROR - JMP out of range");
        exit(1);
    }
}

StackSlot objRefToStackSlot(ObjRef value) {
    StackSlot s;
    s.isObjRef = TRUE;
    s.u.objRef = value;
    return s;
}

StackSlot intToStackSlot(int value) {
    StackSlot s;
    s.isObjRef = FALSE;
    s.u.number = value;
    return s;
}

int stackSlotToInt(StackSlot s) {
    return s.u.number;
}

ObjRef stackSlotToObjRef(StackSlot s) {
    return s.u.objRef;
}

// int bigToInt() -> schaut in bip.op1
// void bigFromInt(int) -> speichert in bip.res
// bigAdd() -> speichert in bip.res

void execute_instruction(int instruction) {
    int opcode = instruction >> 24;
    int immediate = SIGN_EXTEND(instruction & 0x00FFFFFF);

    switch (opcode) {
        case HALT: {
            pc = number_of_instructions;
            gc_run();
            break;
        }
        case PUSHC: {
            bigFromInt(immediate);
            push_stack(objRefToStackSlot(bip.res));
            break;
        }
        case ADD: {
            bip.op2 = stackSlotToObjRef(pop_stack());
            bip.op1 = stackSlotToObjRef(pop_stack());
            bigAdd();
            push_stack(objRefToStackSlot(bip.res));
            break;
        }
        case SUB: {

            bip.op2 = stackSlotToObjRef(pop_stack());
            bip.op1 = stackSlotToObjRef(pop_stack());
            bigSub();
            push_stack(objRefToStackSlot(bip.res));
            break;
        }
        case MUL: {
            bip.op2 = stackSlotToObjRef(pop_stack());
            bip.op1 = stackSlotToObjRef(pop_stack());
            bigMul();
            push_stack(objRefToStackSlot(bip.res));
            break;
        }
        case DIV: {
            ObjRef op2 = stackSlotToObjRef(pop_stack());
            ObjRef op1 = stackSlotToObjRef(pop_stack());

            bip.op1 = op2;
            bigFromInt(FALSE);
            bip.op2 = bip.res;
            if(bigCmp() == 0){
                perror("DIV 0");
                exit(1);
            }

            bip.op1 = op1;
            bip.op2 = op2;

            bigDiv();
            push_stack(objRefToStackSlot(bip.res));
            break;
        }
        case MOD: {
            ObjRef op2 = stackSlotToObjRef(pop_stack());
            ObjRef op1 = stackSlotToObjRef(pop_stack());

            bip.op1 = op2;
            bigFromInt(FALSE);
            bip.op2 = bip.res;
            if(bigCmp() == 0){
                perror("MOD 0");
                exit(1);
            }

            bip.op1 = op1;
            bip.op2 = op2;

            bigDiv();
            push_stack(objRefToStackSlot(bip.rem));
            break;
        }
        case RDINT: {
            char buffer[256];
            fgets (buffer, 256, stdin);
            long number = strtol(buffer, NULL, 0);
            bigFromInt(number);
            push_stack(objRefToStackSlot(bip.res));
            break;
        }
        case WRINT: {
            bip.op1 = stackSlotToObjRef(pop_stack());
            bigPrint(stdout);
            break;
        }
        case RDCHR: {
            char character;
            scanf("%c", &character);
            int charToInt = (int) character;
            bigFromInt(charToInt);
            push_stack(objRefToStackSlot(bip.res));
            break;
        }
        case WRCHR: {
            bip.op1 = stackSlotToObjRef(pop_stack());
            printf("%c", bigToInt());
            break;
        }
        case PUSHG: {
            push_stack(objRefToStackSlot(static_data_area[immediate]));
            break;
        }
        case POPG: {
            static_data_area[immediate] = stackSlotToObjRef(pop_stack());
            break;
        }
        case ASF: {
            push_stack(intToStackSlot(fp));
            fp = sp;
            sp = sp + (int) immediate;
            for(int i = fp; i < sp; i++){
                stack[i] = objRefToStackSlot(NULL);
            }
            break;
        }
        case RSF: {
            sp = fp;
            fp = stackSlotToInt(pop_stack());
            break;
        }
        case PUSHL: { //geht hoffentlich -- hat geklappt
            push_stack(stack[fp + immediate]);
            break;
        }
        case POPL: { //geht hoffentlich 2.0 -- hat geklappt 2.0
            stack[fp + immediate] = pop_stack();
            break;
        }
        case EQ: {
            // bigCmp
            // 0 = eq
            // + = op.1 > op.2
            // - = op.2 > op.1
            bip.op2 = stackSlotToObjRef(pop_stack());
            bip.op1 = stackSlotToObjRef(pop_stack());
            bigFromInt(bigCmp() == 0);
            push_stack(objRefToStackSlot(bip.res));
            break;
        }
        case NE: {
            bip.op2 = stackSlotToObjRef(pop_stack());
            bip.op1 = stackSlotToObjRef(pop_stack());
            bigFromInt(bigCmp() != 0);
            push_stack(objRefToStackSlot(bip.res));
            break;
        }
        case LT: {
            bip.op2 = stackSlotToObjRef(pop_stack());
            bip.op1 = stackSlotToObjRef(pop_stack());
            bigFromInt(bigCmp() < 0);
            push_stack(objRefToStackSlot(bip.res));
            break;
        }
        case LE: {
            bip.op2 = stackSlotToObjRef(pop_stack());
            bip.op1 = stackSlotToObjRef(pop_stack());
            bigFromInt(bigCmp() <= 0);
            push_stack(objRefToStackSlot(bip.res));
            break;
        }
        case GT: {
            bip.op2 = stackSlotToObjRef(pop_stack());
            bip.op1 = stackSlotToObjRef(pop_stack());
            bigFromInt(bigCmp() > 0);
            push_stack(objRefToStackSlot(bip.res));
            break;
        }
        case GE: {
            bip.op2 = stackSlotToObjRef(pop_stack());
            bip.op1 = stackSlotToObjRef(pop_stack());
            bigFromInt(bigCmp() >= 0);
            push_stack(objRefToStackSlot(bip.res));
            break;
        }
        case JMP: {
            jump(immediate);
            break;
        }
        case BRF: {
            bigFromInt(FALSE);
            bip.op1 = stackSlotToObjRef(pop_stack());
            bip.op2 = bip.res;
            int res = bigCmp();
            if (res == 0) {
                jump(immediate);
            }
            break;
        }
        case BRT: {
            bigFromInt(TRUE);
            bip.op1 = stackSlotToObjRef(pop_stack());
            bip.op2 = bip.res;
            int res = bigCmp();
            if (res == 0) {
                jump(immediate);
            }
            break;
        }
        case CALL: {
            push_stack(intToStackSlot(pc + 1));
            pc = immediate - 1;
            break;
        }
        case RET: {
            pc = stackSlotToInt(pop_stack()) - 1;
            break;
        }
        case DROP: {
            sp = sp - immediate;
            break;
        }
        case PUSHR: {
            push_stack(objRefToStackSlot(rvr));
            break;
        }
        case POPR: {
            rvr = stackSlotToObjRef(pop_stack());
            break;
        }
        case DUP: {
            ObjRef first_number = stackSlotToObjRef(pop_stack());
            push_stack(objRefToStackSlot(first_number));
            push_stack(objRefToStackSlot(first_number));
            break;
        }
        case NEW: {
            ObjRef cmpObj;
            /*if ((cmpObj = (ObjRef) alloc_heap(sizeof(unsigned int ) + immediate * sizeof(ObjRef))) == NULL) {
                perror("alloc - NEW");
                exit(1);
            } */
            if ((cmpObj = (ObjRef) alloc_heap(sizeof(struct ObjRef) + ((sizeof(ObjRef) * immediate)))) == NULL) {
                perror("alloc - NEW");
                exit(1);
            }

            cmpObj->size = immediate | MSB;
            for(int i = 0; i < immediate; i++) {
                GET_REFS_PTR(cmpObj)[i] = NULL;
            }

            push_stack(objRefToStackSlot(cmpObj));
            break;
        }
        case GETF: {
            ObjRef tmp = stackSlotToObjRef(pop_stack());
            if(IS_PRIMITIVE(tmp)) {
                perror("GETF - is PrimObj");
                exit(1);
            }
            push_stack(objRefToStackSlot(GET_REFS_PTR(tmp)[immediate]));
            break;
        }
        case PUTF: {
            ObjRef value = stackSlotToObjRef(pop_stack());
            ObjRef obj = stackSlotToObjRef(pop_stack());
            if(IS_PRIMITIVE(obj)){
                perror("PUTF - is PrimObj");
                exit(1);
            }
            GET_REFS_PTR(obj)[immediate] = value;
            break;
        }
        case NEWA: {
            bip.op1 = stackSlotToObjRef(pop_stack());
            int nelem = bigToInt();

            ObjRef cmpObj;
            /*if ((cmpObj = (ObjRef) alloc_heap(sizeof(unsigned int ) + nelem * sizeof(ObjRef))) == NULL) {
                perror("alloc_heap - NEWA");
                exit(1);
            }*/
            if ((cmpObj = (ObjRef) alloc_heap(sizeof(struct ObjRef) + ((sizeof(ObjRef) * nelem)))) == NULL) {
                perror("alloc - NEW");
                exit(1);
            }
            cmpObj->size = nelem | MSB;
            for(int i = 0; i < immediate; i++) {
                GET_REFS_PTR(cmpObj)[i] = NULL;
            }
            push_stack(objRefToStackSlot(cmpObj));
            break;
        }
        case GETFA: {
            bip.op1 = stackSlotToObjRef(pop_stack());
            int index = bigToInt();

            ObjRef array = stackSlotToObjRef(pop_stack());
            if(IS_PRIMITIVE(array)) {
                perror("GETFA - is PrimObj");
                exit(1);
            }
            push_stack(objRefToStackSlot(GET_REFS_PTR(array)[index]));
            break;
        }
        case PUTFA: {
            ObjRef value = stackSlotToObjRef(pop_stack());
            bip.op1 = stackSlotToObjRef(pop_stack());
            int index = bigToInt();
            ObjRef array = stackSlotToObjRef(pop_stack());
            if(IS_PRIMITIVE(array)){
                perror("PUTFA - is PrimObj");
                exit(1);
            }
            if (index < 0 || (index > array->size)) {
                perror("PUTFA - IndexOutOfBounds");
                exit(1);
            }
            GET_REFS_PTR(array)[index] = value;
            break;
        }
        case GETSZ: {
            ObjRef obj = stackSlotToObjRef(pop_stack());
            if(IS_PRIMITIVE(obj)) {
                bigFromInt(-1);
                push_stack(objRefToStackSlot(bip.res));
            }else{
                bigFromInt(GET_ELEMENT_COUNT(obj));
                push_stack(objRefToStackSlot(bip.res));
            }
            break;
        }
        case PUSHN: {
            push_stack(objRefToStackSlot(NULL)); //test
            break;
        }
        case REFEQ: {
            ObjRef obj2 = stackSlotToObjRef(pop_stack());
            ObjRef obj1 = stackSlotToObjRef(pop_stack());
            bigFromInt(obj2 == obj1);
            push_stack(objRefToStackSlot(bip.res));
            break;
        }
        case REFNE: {
            ObjRef obj2 = stackSlotToObjRef(pop_stack());
            ObjRef obj1 = stackSlotToObjRef(pop_stack());
            bigFromInt(obj2 != obj1);
            push_stack(objRefToStackSlot(bip.res));
            break;
        }
        default: {
            printf("DEFAULT CASE");
            break;
        }
    }
}

void execute_program(int gcpurge, int gcstats) {
    init_heap(gcpurge, gcstats);
    stack = malloc(stack_size * 1024);
    while(pc < number_of_instructions) {
        ++pc;
        int instruction = program_memory[pc];
        execute_instruction(instruction);
    }
}

void execute_program_step(void) {
        ++pc;
        int instruction = program_memory[pc];
        execute_instruction(instruction);
}

void execute_debug_instruction(char* user_input) {
    if(strcmp(user_input, "/ps\n") == 0) {
        print_stack();
    } else if (strcmp(user_input, "/psda\n") == 0) {
        print_static_data_area();
    } else if (strcmp(user_input, "/q\n") == 0) {
        printf("exit VM ...\n");
        exit(0);
    } else if (strcmp(user_input, "/pp\n") == 0) {
        print_program_memory();
    } else if (strcmp(user_input, "/step\n") == 0) {
        printf("\n");
        execute_program_step();
        printf("\npc -> %i\n", pc);
    } else if (strcmp(user_input, "/run\n") == 0) {
        execute_program(0,0);
    } else {
        printf("Invalid argument!\n");
    }
}

void execute_debug_program(void) {
    init_heap(0,0);
    stack = malloc(stack_size * 1024);
    printf("\t-- Debug-Mode --\nusage:\n/ps\tprint stack to console\n"
           "/psda\tprint static-data-area to console\n/pp\tprint program to console"
           "\n/step\texecute next program-step\n/run\texecutes the program\n/q\tquit\n\n");

    while (pc < number_of_instructions) {
        char user_input[255];
        fgets(user_input, 255, stdin);
        execute_debug_instruction(user_input);
    }
}