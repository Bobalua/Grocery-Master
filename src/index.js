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

import { argv } from "process";
import { stdin, stdout } from "process";
import * as fs from "node:fs/promises";
import * as readline from 'node:readline/promises';

// Process the arguments
let fileArgument = argv[2];
if (fileArgument == undefined){
    // Set a default value
    fileArgument = "--file=grocery-master.txt"
}

// Sanitize the file argument by removing the '--file=' prefix
const groceryFilePath = fileArgument.replace("--file=", "");

try {
    // if this file doesn't exist it will error and teleport to catch
    await fs.access(groceryFilePath, fs.constants.W_OK);
} catch(err) {
    // if we are in here the file doesn't exist
    await fs.writeFile(groceryFilePath, "");
    // Then we have created it
}

// Create the interface that allows the User to feed the program 
// commands
const rl = readline.createInterface({
    input: stdin,
    output: stdout
})

const data = (await fs.readFile(groceryFilePath)).toString();

const list = data.split("\n");

// interactively run commands inside an "infinite loop"
// Except it's not infinite because if the user enters exit
// We end the loop (by exiting the entire program ☠️)
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
    // in relation to sample code given, item = needle, list = fish, and rmItem = haystack
    // unsure of use of splice method. As written, the intent is to remove 1 value from array 'list' starting at position 'i'
    // can't run app in bash due to user ignorance
    // docker dashboard needs to be open to use docker, because of course you big dummy
    } else if (command == "remove") {
        // console.log(`user removed ${inputs[1]}`);
        const userAskedToRemove = inputs[1];
        let itemRemoved = false;
        for (let i=0; i < list.length; i++) {          
            const currentItem = list[i];
            if (userAskedToRemove == currentItem) {
                list.splice(i, 1);
                itemRemoved = true;
                console.log(`user removed ${inputs[1]}`);
            }   
        }
        if (itemRemoved == false)   {
            console.log('Item does not exist');
        }
        console.log(list);
    } else if (command == "save") {
        let data = "";
        for (let i=0; i < list.length; i++) {
            const currentItem = list[i];
            if (data == "") {
                data = currentItem;
            } else {
                data = data + "\n" + currentItem;    
            }
            
        }
        // Write our list to a file
        await fs.writeFile(groceryFilePath, data);
    } else if (command == "list") {
        console.log(list)
    } else if (command == "help") {
        console.log('Presenting the greatest grocery list manager this side of the Mississippi');
        console.log('   Brought to you by bagboy Bobalua');
        console.log('');
        console.log('Available Commands:');
        console.log('   -add - Add item to grocery list');
        console.log('   -remove - Remove item from grocery list');
        console.log('   -save - Save grocery list');
        console.log('   -help - List of available commands');
        console.log('   -exit - Exits program');
    } else if (command == "quit") {
        process.exit(0);
    } else if (command == "") {
        console.log('please use known command')
    } else {
        console.log('unknown command')
        // user tried to run and unknown command
    }
};

