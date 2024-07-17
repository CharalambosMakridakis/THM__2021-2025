#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include "gc.h"
#include "stack.h"
#include "opCodes.h"
#include "bigint/build/include/bigint.h"
#include "programLoader.h"

unsigned int bytes_relocation = 0;
int count_relocation = 0;
int count_living_objects = 0;
unsigned int bytes_living_objects = 0;
unsigned int bytes_free;
int purge_flag = 0;
int stats_flag = 0;
long heap_size = 8192;
char* heap;
char* end_heap;
char* free_space;
char* target;
char* passive;

void init_heap(int gcpurge, int gcstats) {
    heap = malloc(heap_size * 1024);
    free_space = heap;
    target = heap;
    end_heap = target + (heap_size * 1024) / 2;
    passive = end_heap;
    purge_flag = gcpurge;
    stats_flag = gcstats;
    bytes_free = (heap_size * 1024) / 2;
}

int object_fits_in_heap(unsigned long object_size) {
    return (free_space + object_size) < end_heap ? 1 : 0;
}

void* alloc_heap(unsigned long object_size) {
    if(!object_fits_in_heap(object_size)) {
        gc_run();
        if(!object_fits_in_heap(object_size)) {
            perror("OutOfMemoryError\n");
            exit(1);
        }
    }

    free_space += object_size;
    if(free_space - object_size == NULL) {
        perror("Ungültige Speicheradresse");
        printf("Ungültige Speicheradresse\n");
        exit(1);
    }
    return free_space - object_size;
}


void switch_memory() {
    if(target == heap) {
        target = end_heap;
        free_space = end_heap;
        end_heap = target + ((heap_size * 1024) / 2);
        passive = heap;
    }else {
        target = passive;
        free_space = target;
        end_heap = target + ((heap_size * 1024) / 2);
        passive = end_heap;
    }
}

ObjRef copyObjectToFreeMem(ObjRef orig){
    unsigned long size;
    if(IS_PRIMITIVE(orig)) {
        //size = sizeof(int) + GET_ELEMENT_COUNT(orig);
        size = GET_ELEMENT_COUNT(orig) + sizeof(struct ObjRef);
    } else  {
        //size = sizeof(int) + sizeof(ObjRef) * GET_ELEMENT_COUNT(orig);
        size = sizeof(struct ObjRef) + (sizeof(ObjRef) * GET_ELEMENT_COUNT(orig));
    }

    memcpy(free_space, orig, size);
    ObjRef objRef = (ObjRef) free_space;
    bytes_free -= size;
    free_space += size;
    return objRef;
}


ObjRef relocate(ObjRef orig) {
    ObjRef copy;
    if (orig == NULL) {
        printf("In NULL\n");
        copy = NULL;
    } else {
        if(IS_BROKENHEARTED(orig)){
            printf("In ISBROKEN\n");
            copy = (ObjRef) (target + GET_ELEMENT_COUNT(orig));
        } else {
            printf("Bevor FreeMem\n");
            copy = copyObjectToFreeMem(orig);
            count_relocation++;
            if(IS_PRIMITIVE(copy)){
                bytes_relocation += GET_ELEMENT_COUNT(copy);
            }else{
                bytes_relocation += GET_ELEMENT_COUNT(copy) * sizeof(char*);
            }

            orig->size = (unsigned int) ((char *) copy - target);
            orig->size = orig->size | (SMSB);
        }
    }
    return copy;
}

void copy_root_objects(void) {
    rvr = relocate(rvr);

    for(int i = 0; i < file_number_of_variables; i++){
        static_data_area[i] = relocate(static_data_area[i]);
    }

    for(int i = 0; i < ((stack_size * 1024) / sizeof(StackSlot)); i++){
        if(i < sp && stack[i].isObjRef) {
            stack[i].u.objRef = relocate(stack[i].u.objRef);
        }
    }

    bip.op1 = relocate(bip.op1);
    bip.op2 = relocate(bip.op2);
    bip.res = relocate(bip.res);
    bip.rem = relocate(bip.rem);
}

void scan_cmpObjects(void) {
    printf("In Scan\n");
    char *scan = target;
    unsigned long size;

    while (scan < free_space) {
        ObjRef Objekt = (ObjRef) scan;
        if (!IS_PRIMITIVE(Objekt) && GET_ELEMENT_COUNT(Objekt) > 0){
            printf("ELEMENT COUNT CMP: %i\n", GET_ELEMENT_COUNT(Objekt));
            for (int i = 0; i < GET_ELEMENT_COUNT(Objekt); i++){
                printf("Adresse: %p\n", GET_REFS_PTR(Objekt)[i]);
                if(GET_REFS_PTR(Objekt)[i] == NULL) continue;
                printf("Nach der If-Continue\n");

                GET_REFS_PTR((ObjRef) scan)[i] = relocate(GET_REFS_PTR((ObjRef) scan)[i]);

                if((GET_REFS_PTR((ObjRef) scan)[i]) != NULL && !IS_BROKENHEARTED(GET_REFS_PTR((ObjRef) scan)[i])){
                    bytes_living_objects += GET_ELEMENT_COUNT((GET_REFS_PTR((ObjRef) scan)[i]) );
                }

                count_living_objects++;
                printf("i: %i\n", i);
            }
        }
        if(IS_PRIMITIVE(Objekt)) {
            //size = sizeof(unsigned int) + GET_ELEMENT_COUNT(Objekt);
            size = GET_ELEMENT_COUNT(Objekt) + sizeof(struct ObjRef);
        } else  {
            //size = sizeof(unsigned int ) + GET_ELEMENT_COUNT(Objekt) * sizeof(ObjRef);
            //size = sizeof(unsigned int) + GET_ELEMENT_COUNT(Objekt) * sizeof(char*);
            size = sizeof(struct ObjRef) + (sizeof(ObjRef) * GET_ELEMENT_COUNT(Objekt));
        }
        scan += size;
    }
}

void purge(void) {
    memset(passive, 0, (heap_size * 1024) / 2);
}


void gc_stats(void) {
    printf("Garbage Collector:\n\t"
           "%i objects (%i bytes) allocated since last collection\n\t"
           "%i objects (%i bytes) copied during this collection\n\t"
           "%i of %lu bytes free after this collection\n",
           count_relocation, bytes_relocation, count_living_objects, bytes_living_objects, bytes_free, heap_size * 1024 / 2);
}

void gc_run(void){
    bytes_relocation = 0;
    count_relocation = 0;
    count_living_objects = 0;
    bytes_living_objects = 0;
    bytes_free = heap_size * 1024 / 2;

    switch_memory();
    printf("nach switch memory\n");
    copy_root_objects();
    printf("nach copy\n");
    scan_cmpObjects();
    printf("nach scan\n");
    if(purge_flag) {
        purge();
    }
    if(stats_flag) {
        gc_stats();
    }
}


