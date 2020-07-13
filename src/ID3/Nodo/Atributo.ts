
class Atributo {

    private merito: number;
    private nombre: string;
    counterDecissions: Map<string, Map<string,number>>;

    constructor(n: string) {
        this.merito = 0;
        this.nombre = n;
        this.counterDecissions = new Map<string, Map<string,number>>();
    }

    informacion(  p: number,   n: number): number{
        let auxp: number;
        let auxn: number;
        if(p === 0) {
            auxp = 0;
        } else {
            auxp = (-p*(Math.log2(p)));
        }
        if(n === 0) {
            auxn = 0;
        } else {
            auxn = (-n*(Math.log2(n)));
        }
        let sol = auxp + auxn;
        return sol;
    }


    initializerValues(valor: string, decision: Array<string>) : void{
        let newMap: Map<string, number> = new Map<string, number>();
        decision.forEach((d) => newMap.set(d,0));
        this.counterDecissions.set(valor, newMap);
    }

    insertValue(valor: string, decision:string): void {
        let num = this.counterDecissions.get(valor);
        if(typeof(num) !== "undefined"){
            let key = num.get(decision);
            if(typeof(key) === "number")
                num.set(decision, key + 1);
        }
    }

    calcularMerito() : void{
        this.merito = 0;
        let N: number = 0;
        let counter: number = 0;
        let state: boolean = true;

        let a: Array<number> = new Array<number>();
        let r: Array<number>= new Array<number>();
        let p: Array<number>= new Array<number>();
        let n: Array<number>= new Array<number>();


        this.counterDecissions.forEach((value, key) => {
            a.push(0);
            value.forEach((v, k) => {
                    a[a.length -1] += v;
                    N += v;
            });
        });

        this.counterDecissions.forEach((value, key) => {
            value.forEach((v, k) => {
                if(state)
                    p.push(v/a[counter]);
                else
                    n.push(v/a[counter]);
                state = !state;
            });
            counter++;
        });

        for (let i: number = 0 ; i < a.length ; ++i)
            r.push(a[i]/N);

        for (let i: number = 0; i < r.length ; ++i)
            this.merito += r[i] * this.informacion(p[i],n[i]);

    }

    getName(): string {
        return this.nombre;
    }

    getMerito() : number{
        return this.merito;
    }

    getValues(): Array<string> {
        let values = new Array <string>();
        this.counterDecissions.forEach((value, key) =>{
           values.push(key);
        });
        return values;
    }
}

export default Atributo;
