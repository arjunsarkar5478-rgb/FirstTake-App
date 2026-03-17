// 1. Require the database
const db = require('../services/db');

// 2. Create the class
class Module {
    constructor(id) {
        this.id = id;
    }
    
}

// 3. Export the class 
module.exports = { Module };