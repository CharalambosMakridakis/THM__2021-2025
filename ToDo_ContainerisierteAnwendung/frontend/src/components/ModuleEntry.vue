<template>
<tr class="text-white font-bold">
    <td>{{ props.entry.moduleName }}</td>
    <td>{{ props.entry.crp }}</td>
    <td>{{ props.entry.grade }}</td>
    <td>{{ props.entry.weight }}</td>
    <td>
        <button class="text-[#213547] hover:bg-[#A76F6F] bg-[#EAB2A0] font-bold" @click="editEntry">
            Edit
        </button>
    </td>
    <td>
        <button class="text-[#213547] hover:bg-[#A76F6F] bg-[#EAB2A0] font-bold" @click="deleteEntry">
            Delete
        </button>
    </td>
</tr>
<div v-if="showEditWindow">
                <ModalEdit 
                    :showModalWindow="showEditWindow"
                    :oldEntry="props.entry"
                    @update:showModalWindow="closeEditModal"
                >
                </ModalEdit>
            </div>
</template>
  
<script setup lang="ts">
    import { Ref, ref } from 'vue';
    import { deleteTableEntry } from '../globalObjects/tableStore';
    import { tableEntry } from './Interfaces';
    import ModalEdit from './ModalEdit.vue';

    const emits = defineEmits();
    const showEditWindow: Ref<boolean> = ref(false);

    const props = defineProps<{
        entry: tableEntry,
    }>();

    function editEntry(): void {
        showEditWindow.value = true;
    }

    function closeEditModal(value: boolean){
        showEditWindow.value = value;
    }

    function deleteEntry(): void {
        deleteTableEntry(props.entry.index);
        emits('update:updateData', );
    }
</script>
  
<style>

</style>