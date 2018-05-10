const {ObjectID} = require("mongodb");
// let id2 = new ObjectID("aaaaaaaaaaaa");
// console.log(id2); // returns hexadecimal value 616161616161616161616161 which corresponds to the string aaaaaaaaaaaa

let id = new ObjectID();
console.log(id); 
console.log(id.toString());
console.log(id.toHexString());

let id2 = id.toHexString();
console.log(id2);

