class Person {
    constructor (name) {
        this.name = name;
    }
    hello() {
        if (typeof this.name === 'string') {
            return `${hello}, I am your new friendly neighborhood dev ${person.name}!`;
        } else {
            return 'Hello!';
        }
    } 
}

let person = new Person('Jacy');
let hello = 'Hello world';


document.write(`<p>${person.hello()}</p>`); 