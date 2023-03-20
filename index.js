const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'password',
    database: 'employee_tracker_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database!');
    employee_tracker();
})

let employee_tracker = function () {
    inquirer.prompt([{
        type: 'list',
        name: 'prompt',
        message: 'Please select an option.',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role', 'Quit']
    }]).then ((answers) => {
        if (answers.prompt === 'View all departments') {
            db.query(`SELECT * FROM departments`, (err, result) => {
                if (err) throw err;
                console.log('Now viewing all departments');
                console.table(result);
                employee_tracker();
            })
        }
    })
}

module.exports = db;