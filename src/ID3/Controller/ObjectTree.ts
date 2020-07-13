class ObjectTree {
    private _name: string;
    private _children: Array<ObjectTree>;
    constructor() {
        this._name = "";
        this._children = [];
    }

    getName(): string {
        return this._name;
    }

    setName(value: string) {
        this._name = value;
    }

    getChildren(): Array<ObjectTree> {
        return this._children;
    }

    setChildren(value: Array<ObjectTree>) {
        this._children = value;
    }

    appendChild(child: ObjectTree): void {
        this._children.push(child);
    }

    findIndexSubTree(name: string): number{
        let stop: boolean = false;
        let i: number = 0;
        while (!stop){
            stop = (this._children[i]._name.localeCompare(name) === 1);
        }
        return i;
    }
}

export default ObjectTree;
