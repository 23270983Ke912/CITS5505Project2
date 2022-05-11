class ScriptLoader {

    constructor(script){
        this.script = script;
        this.scriptElement = document.createElement('script');
        this.head = document.querySelector('head');
    }

    load(){
        return new Promise((resolve, reject) => {
            this.scriptElement.src = this.script;
            this.scriptElement.onload = e => resolve(e);
            this.scriptElement.onerror = e => reject(e);
            this.head.appendChild(this.scriptElement);
        })
    }

}

const loader = new ScriptLoader('dynamic.js');
const button = document.querySelector('button');

button.onclick = _ => loader.load().then(e => console.log(e)).catch(e => console.error(e));