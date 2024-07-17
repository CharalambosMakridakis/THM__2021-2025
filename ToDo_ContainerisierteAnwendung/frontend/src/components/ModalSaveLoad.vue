<template>
    <div class="fixed inset-0 flex items-center justify-center">
    </div>
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>
  
        <div class="fixed inset-0 overflow-y-auto">
          <div
            class="flex min-h-full items-center justify-center p-4 text-center"
          >
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900"
                >
                  <p class="font-bold text-xl mb-5">
                    {{ props.isForLoading ? 'Load' : 'Save' }}
                  </p>
                </DialogTitle>
                <div class="mt-2 flex flex-col gap-4">
                  <input class="p-1 border-2 border-black bg-white text-black placeholder-black rounded" v-model="name" placeholder="Name" />
                </div>
                <div class="flex mt-2">
                  <button
                    type="button"
                    class="flex-none inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="saveInput"
                  >
                    {{ props.isForLoading ? 'Load' : 'Save' }}
                  </button>
                  <div class="flex-grow">

                  </div>
                  <button
                    type="button"
                    class="flex-none inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="closeModal"

                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  
  <script setup lang="ts">
    import { Ref, ref } from 'vue'
    import {
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogPanel,
        DialogTitle,
    } from '@headlessui/vue'
    import { saveTableData, setTableData } from '../globalObjects/tableStore';

    const props = defineProps<{
        showModalWindow: boolean, // Ref<boolean>
        isForLoading: boolean;
    }>();

    const emits = defineEmits();
    
    const isOpen: Ref<boolean> = ref(!!props.showModalWindow);
    const name: Ref<string> = ref('');

    function closeModal() {
        //isOpen.value = false;
        emits('update:showModalWindow', false);
    }

    async function saveInput(): Promise<void> {
        name.value = name.value.replace(/\s/g, "");

        if(name.value === '') {
        alert("Feld darf nicht leer sein!");
        return;
        }

        if(props.isForLoading) {
            await setTableData(name.value);
            emits('update:update', );
        }else{
            saveTableData(name.value);
            emits('update:update', );
        }

        closeModal();
    }

  </script>
  