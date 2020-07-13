import Table from "../Table/Table"
import ObjectTree from "./ObjectTree";

function applyID3(principal: Table, oneIteration: boolean): object {
    let obj= {};
    if(oneIteration)
        id3OneIteration(principal);
    else{
        let tree =  id3Recursive(principal);
        obj = loopItem(tree);
    }
    return obj;
}

function loopItem(tr: ObjectTree): object{
    let tree: any = {};
    tree.name= tr.getName();
    if(tr.getChildren().length !== 0)
        tree.textProps= {x: -25, y: 25}
    tree.children = [];
    tr.getChildren().forEach((e) => {
        if(e.getName().localeCompare("") !== 0)
            tree.children.push(loopItem(e));
    });
    return tree;
}

function id3OneIteration(table: Table): void{
    if(!table.isFinalTable()) {
        table.solveTableWithID3();
        for(let secondTable of table.getSubTables()){
            console.log(secondTable);
        }
    }
}

function id3Recursive(table: Table): ObjectTree {
    let tree = new ObjectTree();
    if(!table.isFinalTable()) {
        tree = table.solveTableWithID3();

        for(let i = 0; i < table.getSubTables().length; i++){
            let subtree = tree.getChildren()[i];
            subtree.appendChild(id3Recursive(table.getSubTables()[i]));
        }

    }
    return tree;
}

export default applyID3;
