var virtualSystem = require("kaeon-united")("virtualSystem");

let mark = window.terminals[0].getMark();
mark = mark.substring(0, mark.length - 1).trim();

console.log(JSON.stringify(virtualSystem.getResource(mark), null, "\t"));