import { Ref, ref } from 'vue';
import { resInterface, tableEntry } from '../components/Interfaces';

let tableData: Ref<resInterface> = ref({ 
    meta: {
        from: "",
        avg: ""
    },
    table: []
    });

function getTableData(): tableEntry[] {
  return tableData.value.table;
}

async function setTableData(name: string): Promise<boolean> {
    
    try {
        const response = await fetch('http://localhost/api/load', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name }),
        })
    
        const data: resInterface = await response.json();
        tableData.value = data;
        updateAvg();
        return true
    } catch (error) {
        return false;
    }
}

async function saveTableData(name: string): Promise<boolean> {
    try {
        tableData.value.meta.from = name;

        await fetch('http://localhost/api/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: tableData.value }),
        });
        
        return true;
    } catch (error) {
        return false;
    }
}

function updateAvg(): void {
    const length = tableData.value.table.length;
    let sum = 0;
    tableData.value.table.forEach(element => {
        sum += element.grade * element.weight;
    });
    
    tableData.value.meta.avg = "" + (sum / length);
}

function editEntry(index: string, newtableEntry: tableEntry): void {
    tableData.value.table.forEach(x => {
        if(x.index === index) {
            x.crp = newtableEntry.crp;
            x.moduleName = newtableEntry.moduleName;
            x.grade = newtableEntry.grade;
            x.weight = newtableEntry.weight;
        }
    });
    updateAvg();
}

function addTableEntry(newEntry: tableEntry): void {
  tableData.value.table.push(newEntry);
  updateAvg();
}
function deleteTableEntry(index: string): void {
    tableData.value.table = tableData.value.table.filter(x => x.index != index);
    updateAvg();
}

export { tableData, saveTableData, editEntry, getTableData, setTableData, addTableEntry, deleteTableEntry };