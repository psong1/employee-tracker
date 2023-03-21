const inquirer = require('inquirer');
const db = require('./db/connect');

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
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add role', 'Add an employee', 'Update employee role', 'Quit']
    }]).then ((answers) => {
        if (answers.prompt === 'View all departments') {
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;
                console.log('Now viewing all departments');
                console.table(result);
                employee_tracker();
            });

        } else if (answers.prompt === 'View all roles') {
            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) throw err;
                console.log('Now viewing all roles');
                console.table(result);
                employee_tracker();
            });

        } else if (answers.prompt === 'View all employees') {
            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) throw err;
                console.log('Now viewing all employees');
                console.table(result);
                employee_tracker();
            });

        } else if (answers.prompt === 'Add a department') {
            inquirer.prompt ([{
                type: 'input',
                name: 'department',
                message: 'Please enter the name of the department.',
            }]).then((answers) => {
                db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
                    if (err) throw err;
                    console.log(`${answers.department} has been added to departments.`);
                    employee_tracker();
                });
            })

        } else if (answers.prompt === 'Add a role') {
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;
                inquirer.prompt([
                {
                    type: 'input',
                    name: 'role',
                    message: 'What is the role?',
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: `What is the role's salary?`,
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department does the role belong to?',
                    choices: () => {
                        let departmentArr = [];
                        for (let i = 0; i < result.length; i++) {
                            departmentArr.push(result[i].name);
                        }
                        return departmentArr;
                    }
                }
            ]).then((answers) => {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].name === answers.department) {
                        let department = result[i];
                    }
                }
                db.query(`INSERT INTO role (title, salary department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, result) => {
                    if (err) throw err;
                    console.log(`${answers.role} has been added.`);
                    employee_tracker();
                })
            });
        
            });

        } else if (answers.prompt === 'Add an employee') {
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;
                inquirer.prompt ([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: `What is the employee's first name?`,
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: `What is the employee's last name?`,
                    },
                    {
                        type: 'input',
                        name: 'role',
                        message: `What is the employee's role?`,
                    },
                    {
                        type: 'input',
                        name: 'manager',
                        message: 'Who is the employees manager?',
                    }
                ]).then((answers) => {
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            let role = result[i];
                        }
                    }
                    db.query(`INSERT INTO employee (first_name, last_name, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName. answers.lastName, role.id, answers.manager], (err, result) => {
                        if (err) throw err;
                        console.log(`${answers.firstName} ${answers.lastName} has been added.`);
                        employee_tracker();
                    });
                })
            })

        } else if (answers.prompt === 'Update employee role') {
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;
                inquirer.prompt ([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee do you want to update?',
                        choices: () => {
                            let array = [];
                            for (let i =0; i < result.length; i++) {
                                array.push(result[i].last_name);
                            }
                            let employeeArr = [...new Set(array)];
                            return employeeArr;
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: `What is the employee's new role?`,
                        choices: () => {
                            let array = [];
                            for (let i = 0; i < result.length; i++) {
                                array.push(result[i].last_name);
                            }
                            let roleArr = [...new Set(array)];
                            return roleArr;
                        }
                    }
                ]).then((answers) => {
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].last_name === answers.employee) {
                            let name = result[i];
                        }
                    }

                    for (let i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            let role = result[i];
                        }
                    }

                    db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (err, result) => {
                        if (err) throw err;
                        console.log(`${answers.employee} has been updated.`);
                        employee_tracker();
                    });
                })
            });

        } else if (answers.prompt === 'Quit') {
            db.end();
            console.log('Closing application.');
        }

    })
}

