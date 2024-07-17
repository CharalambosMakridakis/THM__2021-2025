<template>
    <div class="bg-[#2D4356] p-3 rounded-lg border-2 border-[#EAB2A0] shadow-2xl">
        <button @click="add()" class="hover:bg-[#A76F6F] bg-[#EAB2A0] font-bold">
            Add
        </button>
        <button @click="save()" class="hover:bg-[#A76F6F] bg-[#EAB2A0] font-bold" :disabled="showInputWindow">
            Save
        </button>
        <button @click="load()" class="hover:bg-[#A76F6F] bg-[#EAB2A0] font-bold" :disabled="showInputWindow">
            Load
        </button>
        <h2 class="text-white mt-4 text-2xl font-bold">LIST OF GRADES</h2>
        <div class="mx-auto mt-4 w-[90%] border-t-2 rounded border-[#EAB2A0]"/>
            <p class="text-white font-bold mx-[5px] mb-[5px] mt-2">Grade average: {{ parseFloat(tableData.meta.avg) ?  parseFloat(tableData.meta.avg).toFixed(1) : 0 }}</p>
        <table class="table text-white mt-2 w-[90%] mx-auto">
            <thead>
                <tr class="w-full border-b-2 text-[#EAB2A0] text-xl font-bold  border-[#EAB2A0]">
                    <th>Module</th>
                    <th>Crp</th>
                    <th>Grade</th>
                    <th>Weight</th>
                </tr>
            </thead>
            <tbody v-for="entry in data">
                <ModuleEntry 
                :entry="entry"
                @update:updateData="fetchData"
                ></ModuleEntry>
            </tbody>
            <div v-if="showInputWindow">
                <ModalInput 
                    :showModalWindow="showInputWindow"
                    @update:showModalWindow="updateShowModal"
                >
                </ModalInput>
            </div>
            <div v-if="showLoadSaveWindow">
                <ModalSaveLoad
                    :isForLoading="isForLoading"
                    :showModalWindow="showLoadSaveWindow"
                    @update:showModalWindow="updateShowLoadSaveWindow"
                    @update:update="fetchData"
                >
                </ModalSaveLoad>
            </div>
        </table>
    </div>
</template>
  
<script setup lang="ts">
    import ModuleEntry from './ModuleEntry.vue';
    import ModalInput from './ModalInput.vue';
    import { ref, Ref } from 'vue';
    import { tableEntry } from './Interfaces';
    import { getTableData, tableData } from '../globalObjects/tableStore';
    import ModalSaveLoad from './ModalSaveLoad.vue'

    const data: Ref<tableEntry[]> = ref([]);
    const showLoadSaveWindow: Ref<boolean> = ref(false);
    const showInputWindow: Ref<boolean> = ref(false);

    let isForLoading = false;

    const fetchData = async () => {
        data.value = getTableData();
    };

    function updateShowModal(value: boolean) {
        showInputWindow.value = value;
        fetchData();
    }

    function updateShowLoadSaveWindow(value: boolean) {
        showLoadSaveWindow.value = value;
    }

    function add() {
        showInputWindow.value = true;
    }

    function save() {
        isForLoading = false;
        showLoadSaveWindow.value = true
    }

    function load() {
        isForLoading = true;
        showLoadSaveWindow.value = true
    }
</script>
  
<style>
    button {
        margin: 5px;
    }
</style>
  
