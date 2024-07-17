export interface resInterface {
    meta: {
        from: string,
        avg: string
    },
    table: tableEntry[]
}

export interface tableEntry {
    index: string,
    moduleName: string,
    crp: number, 
    grade: number, 
    weight: number
}