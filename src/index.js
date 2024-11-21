/* 
0. handle arguments
1. create new list if none exists or is selected
2. search specified directory for existing list
3. interactively run user supplied commands
    - add item
    - remove item
    - save
    - list
    - help
    - quit
*/

import {argv} from "process";
import * as fs from "node:fs/promises";
import * as readline from 'node:readline/promises';
import {stdin, stdout} from "process";

let fileArgument = argv[2];
if (fileArgument == undefined){
    fileArgument = "--file=grocery-master.txt"
}

const groceryFilePath = fileArgument.replace("--file=", "")

try {
    await fs.access(groceryFilePath, fs.constants.W_OK);
} catch(err) {
    // if we are in here the file doesn't exist
    await fs.writeFile(groceryFilePath, "");
}

// by now grocery file path exists, hopefully
const groceryFile = fs.open(groceryFilePath, "w");
const rl = readline.createInterface({
    input: stdin,
    output: stdout
})

// todo - load list from file
const list = [];

// interactively run commands
while (true) {
    
    // 1. get command
    // 2. determine what command was given
    // 3. run command
    // 4. if command was exit, break loop

    const inputs = (await rl.question("> ")).split(" ");
    // if user gives "add banana" inputs will now be ["add", "banana"] 
    // if user gives "list" inputs will now be ["list"]
    const command = inputs[0];
    
    if (command == "add") {
        console.log(`user tried to add ${inputs[1]}`);
        const item = inputs[1];
        list.push(item)
    } else if (command == "remove") {
        console.log("remove")
    } else if (command == "save") {
        console.log("save")
    } else if (command == "list") {
        console.log(list)
    } else if (command == "help") {
        console.log("help")
    } else if (command == "quit") {
        process.exit(0);
    } else {
        // user tried to run and unknown command
    }
};

