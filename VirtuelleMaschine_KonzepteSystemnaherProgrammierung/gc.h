//
// Created by Nikos on 07.01.2023.
//

#ifndef KSP_GC_H
#define KSP_GC_H
extern long heap_size;
void init_heap(int gcpurge, int gcstats);
void* alloc_heap(unsigned long object_size);
void gc_run(void);
#endif //KSP_GC_H
