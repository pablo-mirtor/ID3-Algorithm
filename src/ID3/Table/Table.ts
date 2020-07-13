import Atributo from "../Nodo/Atributo";
import ObjectTree from "../Controller/ObjectTree";

class Table {

    private isFinal: boolean;
    private name: string;
    private secondaryTables: Array<Table>;
    private decisionList: Set<string>;
    private dataList: Array<Array<string>>;
    private atributeList: Array<Atributo>;

    constructor(n: string) {
        this.name = n;
        this.isFinal = false;
        this.dataList = new Array<Array<string>>();
        this.secondaryTables = new Array<Table>();
        this.decisionList = new Set<string>();
        this.atributeList = new Array<Atributo>();
    }

    setAtributteList(atrList: Array<Atributo>): void{
        this.atributeList = atrList;
    }

    setData(dataList: Array<Array<string>>): void{
        this.dataList = dataList;
    }

    generateDecisionList(): void{
        for(let row: number = 0; row < this.dataList.length; row++)
            this.decisionList.add(this.dataList[row][this.dataList[row].length-1]);
    }


    solveTableWithID3(): ObjectTree {
        let tree: ObjectTree = new ObjectTree();
        this.generateDecisionList();
        for (let column: number = 0 ; column < this.atributeList.length; column++) {
            let atribute: Atributo = this.atributeList[column];

            for (let row: number = 0 ; row < this.dataList.length ; ++row){
                let a = Array.from(this.decisionList);
                atribute.initializerValues(this.dataList[row][column],a);
            }

            for (let fila: number = 0 ; fila < this.dataList.length ; ++fila)
                atribute.insertValue(this.dataList[fila][column],this.dataList[fila][this.dataList[fila].length-1]);

            atribute.calcularMerito();
        }

        let index: number = this.atributeList.indexOf(this.getLowestEntropy());

        tree.setName(this.atributeList[index].getName());
        for(let atributeProperty of this.getLowestEntropy().getValues()) {
            let newSubTable: Table = new Table(atributeProperty);
            let secondTree: ObjectTree = new ObjectTree();
            secondTree.setName(atributeProperty);

            let atributeListCopy: Array<Atributo> = [...this.atributeList];
            atributeListCopy.splice(index,1)
            newSubTable.setAtributteList(atributeListCopy);

            let dataCopy: Array<Array<string>> = [...this.dataList];

            for (let fila: number = 0 ; fila < dataCopy.length ; ++fila) {
                if (dataCopy[fila][index].localeCompare(atributeProperty) !== 0) {
                    dataCopy.splice(fila,1);
                    --fila;
                }
            }

            for( let fila of dataCopy)
                fila.splice(index, 1);

            newSubTable.setDatos(dataCopy);
            newSubTable.generateDecisionList();
            newSubTable.isFinal = (newSubTable.decisionList.size === 1);

            if(newSubTable.isFinal){
                let endTree: ObjectTree = new ObjectTree();
                endTree.setName(Array.from(newSubTable.decisionList)[0]);
                secondTree.appendChild(endTree);
            }
            tree.appendChild(secondTree);
            this.secondaryTables.push(newSubTable);
        }
        return tree;
    }

    setDatos(d: Array<Array<string>>): void {
        this.dataList = d;
    }

    getSubTables(): Array<Table> {
        return this.secondaryTables;
    }

     isFinalTable() : boolean {
        return this.isFinal;
    }

    getNombre() : string {
        return this.name;
    }


    getLowestEntropy(): Atributo{
         let min: number = 100;
         let atr: Atributo = new Atributo("n");
         for(let i = 0; i < this.atributeList.length; i++){
             if(this.atributeList[i].getMerito() < min){
                 atr = this.atributeList[i];
                 min = this.atributeList[i].getMerito();
             }
         }
        return atr;
    }

};

export default Table;
