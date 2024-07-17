//
// Created by Nikos on 27.10.2022.
//

#include <stdio.h>
#include <stdlib.h>
#include "stack.h"
#include "globals.h"


void read_program(FILE *fp);
int file_number_of_variables;

void validate_and_read_program(FILE *fp)
{
    int file_first_four_bytes;
    int file_version_number;
    int ignore_version = 0; 


    fread(&file_first_four_bytes, sizeof(int), 1, fp);
    if(file_first_four_bytes != 0x46424a4e)
    {
        perror("ERROR - wrong binary format");
        exit(1);
    }

    fread(&file_version_number, sizeof(int), 1, fp);
    if(file_version_number != VERSION_NUMBER && ignore_version)
    {
        perror("ERROR - version number mismatch");
        exit(1);
    }

    fread(&number_of_instructions, sizeof(int), 1, fp);

    fread(&file_number_of_variables, sizeof(int), 1, fp);

    read_program(fp);
}

void read_program(FILE *fp)
{
    if((program_memory = malloc(number_of_instructions * sizeof(int))) == NULL) {
        perror("ERROR - program-memory can't be allocated");
        exit(1);
    }
    if((static_data_area = malloc(file_number_of_variables * sizeof(ObjRef))) == NULL) {
        perror("ERROR- SDA can't be allocated");
        exit(1);
    }
    for(int i = 0; i < file_number_of_variables; i++) {
        static_data_area[i] = NULL;
    }
    fread(program_memory, sizeof(int), number_of_instructions, fp);
    fclose(fp);
}



