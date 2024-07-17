#include <stdio.h>  // input output
#include <string.h> // Braucht man für stdcmp
#include <stdlib.h> // Braucht man für exit(0)

#include "programLoader.h"
#include "globals.h"
#include "stack.h"
#include "gc.h"

void check_start_params(int argc, char *argv[])
{
    FILE *fp;
    int arg_file = 0;
    int arg_version = 0;
    int arg_help = 0;
    int arg_debug = 0;
    int arg_stack = 0;
    int arg_heap = 0;
    int arg_gcpurge = 0;
    int arg_gcstats = 0;
    //0 = no arg in argv
    //1 = arg appeared in argv

    for (int i = 1; i < argc; i++) {
        if(arg_stack == 1){
            arg_stack = 0;
            continue;
        }
        if(arg_heap == 1){
            arg_heap = 0;
            continue;
        }
        if ((fopen(argv[i], "r")) != NULL) {
            fp = fopen(argv[i], "r");
            ++arg_file;
            argv[i] = NULL;
        } else if (strcmp(argv[i], "--version") == 0) {
            arg_version = 1;
            argv[i] = NULL;
        } else if (strcmp(argv[i], "--help") == 0) {
            arg_help = 1;
            argv[i] = NULL;
        } else if (strcmp(argv[i], "--debug") == 0) {
            arg_debug = 1;
            argv[i] = NULL;
        } else if (strcmp(argv[i], "--stack") == 0){
            arg_stack = 1;
            argv[i] = NULL;
            if(argc - 1 == i) {
                perror("--stack: usage --stack [heap_size]");
                exit(1);
            }
            stack_size = strtol(argv[i + 1],NULL, 0);
            argv[i + 1] = NULL;
        } else if (strcmp(argv[i], "--heap") == 0) {
            arg_heap = 1;
            argv[i] = NULL;
            if(argc - 1 == i) {
                perror("--heap: usage --heap [heap_size]");
                exit(1);
            }
            heap_size = strtol(argv[i + 1],NULL, 0);
            argv[i + 1] = NULL;
        } else if (strcmp(argv[i], "--gcpurge") == 0) {
            arg_gcpurge = 1;
            argv[i] = NULL;
        } else if (strcmp(argv[i], "--gcstats") == 0) {
            arg_gcstats = 1;
            argv[i] = NULL;
        }
    }

        for (int i = 1; i < argc; i++) {
            if (argv[i] != NULL) {
                printf("unknown command line argument '%s', try './njvm.out --help'\n", argv[i]);
                exit(1);
            }
        }
        if (arg_help == 1) {
            printf("usage: ./njvm.out [option] [option] ...\n--version\tshow version and exit\n--help\t\tshow this help and exit\n");
            exit(0);
        }
        if (arg_version == 1) {
            printf("Ninja Virtual Machine version %i\n", VERSION_NUMBER);
            exit(0);
        }
        if (arg_file > 1) {
            printf("too many file inputs: %i instead of 1\n", arg_file);
            exit(1);
        }
        if (arg_debug == 1) {
            if (arg_file < 1) {
                printf("file input is needed for: --debug\n");
                exit(1);
            } else {
                validate_and_read_program(fp);
                execute_debug_program();
            }
        }

        if (arg_file == 1 && arg_debug == 0) {
            validate_and_read_program(fp);
            execute_program(arg_gcpurge, arg_gcstats);
        }

}


int main(int argc, char *argv[])
{ // argc Anzahl der Aufrufparameter. (./njvm.out --version <- 2 Aufrufparameter)
    printf("Ninja Virtual Machine started\n");
    check_start_params(argc, argv);
    printf("Ninja Virtual Machine stopped\n");
    return 0;
}