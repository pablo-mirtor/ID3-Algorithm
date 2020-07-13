import React from 'react';
import Atributo from "../ID3/Nodo/Atributo";
import Table from "../ID3/Table/Table";
import applyID3 from "../ID3/Controller/Controller"
import Tree from 'react-tree-graph';
import "./Content.css";


class Content extends React.Component {
    private fileAtributesInput: React.RefObject<HTMLInputElement>;
    private fileDataInput: React.RefObject<HTMLInputElement>;
    private table: Table;
    private atributesList: Array<Atributo>;
    private data: object;
    state = {datos: {}, disabled: false}
    constructor(props: object) {
        super(props);
        this.fileDataInput = React.createRef();
        this.fileAtributesInput = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.solveMap = this.solveMap.bind(this);
        this.table = new Table("");
        this.data = {};
        this.atributesList = new Array<Atributo>();
    }


    handleSubmit(event: React.FormEvent<HTMLInputElement>) {
        this.setState({datos: {}, disabled: true})
        event.preventDefault();
        if(this.fileDataInput.current != null && this.fileDataInput.current.files != null && this.fileAtributesInput.current != null && this.fileAtributesInput.current.files != null){
            this.handleFileAttributes(this.fileAtributesInput.current.files[0]);
            this.handleFileChosen(this.fileDataInput.current.files[0]);
            setTimeout(this.solveMap, 5000, this.table);
        }
    }

    solveMap(table: Table){
        this.data = applyID3(table, false);
        console.log(this.data);
        this.setState({datos: this.data, disabled: true});
    }

     handleFileAttributes(file: File): void{
        const reader = new FileReader();
        let attributesArray = new Array<Atributo>();
        reader.onload = (event) => {
            let text: string | ArrayBuffer | null;
            if(event != null && event.target != null ) {
                text = event.target.result;
                let lines = new Array<string>();
                if(text != null && typeof(text) === "string") {
                    lines = text.split(',');
                    for(let i = 0; i < lines.length - 1; i++){
                        attributesArray.push(new Atributo(lines[i]));
                    }
                }
            }
        };
        reader.readAsText(file);
        this.atributesList = attributesArray;
        this.table.setAtributteList(attributesArray);
    }

    handleFileChosen(file: File): void{
        const reader = new FileReader();
        let dataArray = new Array<Array<string>>();
        reader.onload = (event) => {
            let text: string | ArrayBuffer | null;
            if(event != null && event.target != null ) {
                text = event.target.result;
                let lines = new Array<string>();
                if(text != null && typeof(text) === "string") {
                    lines = text.split(/[\r\n]+/g);
                    lines.forEach((l) => {
                        let rowData = new Array<string>();
                        let row = l.split(',');
                        if(row.length > 1 && row.length !== this.atributesList.length + 1){
                            alert("El número de atributos no coincide con el número de datos");
                            this.reset();
                            throw "El número de atributos no coincide con el número de datos";
                        }
                        if(row.length !== 1){
                            row.forEach((d) => rowData.push(d));
                            dataArray.push(rowData);
                        }

                    });
                }
            }
        };
        reader.readAsText(file);
        this.table.setData(dataArray);
    }

    reset(): void{
        window.location.reload(false);
    }

    render() {
        return (<div className={"contenido"}>
                <form onSubmit={this.handleSubmit}>
                    <div className={"line"}>
                        <label>Selecciona el fichero de <b>atributos</b>: </label>
                        <input type="file" accept=".txt" ref={this.fileAtributesInput} multiple={false} required={true} disabled={this.state.disabled}/>
                    </div>
                    <div className={"line"}>
                         <label>Selecciona el fichero de <b>ejemplos</b>: </label>
                         <input type="file" accept=".txt" ref={this.fileDataInput} multiple={false} required={true} disabled={this.state.disabled}/>
                    </div>
                    <input type="submit" value="Realizar algoritmo" disabled={this.state.disabled}/>
                </form>
                <form></form>
                <button onClick={this.reset}>Empezar de nuevo</button>
                <Tree nodeRadius={15} data={this.state.datos} height={400} width={800} margins={{ top: 20, bottom: 10, left: 20, right: 200 }}></Tree>
        </div>
        );
    }
}

export default Content;
