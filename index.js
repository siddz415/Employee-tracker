// inquirer

//mysql2 to connect and query
const logo = require('asciiart-logo');
const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Boss29!988",
    database: "company_db"
})

db.connect(function (err) {
    if (err) throw err;
    initialize()
})

function initialize() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            choices: ["View All Departments", "View All Employees", "View All Roles", "Add Employee", "Add Role", "Add Department", "Update Employee Role", "Remove Employee", "Quit"],
            message: "What would you like to do today?"
        }
    ]).then(({ choice }) => {
        switch (choice) {
            case 'View All Employees':
                viewEmp();
                break;

            case 'View All Roles':
                viewRole();
                break;

            case 'View All Departments':
                viewDept();
                break;

            case 'Add Employee':
                addEmp();
                break;

            case 'Add Role':
                addRole();
                break;

            case 'Add Department':
                addDept();
                break;

            case 'Update Employee Role':
                updateEmpRole();
                break;

            case 'Remove Employee':
                deleteEmp();
                break;

            case 'Quit':
                quit();
                break;
        }
    })
}


function viewDept() {
    let queryString = `
    SELECT * FROM department`

    db.query(queryString, (err, data) => {
        if (err) throw err;

        console.log('\n')
        console.table(data)
        console.log('\n')

        initialize()
    })
}

function viewRole() {
    let queryrString = `
    SELECT roles.id, title, salary, name AS department_name
    FROM roles
    JOIN department
    ON department.id = department_id`

    db.query(queryrString, (err, data) => {
        if (err) throw err;

        console.log('\n')
        console.table(data)
        console.log('\n')

        initialize()
    })
}

function viewEmp() {
    let queryeString = `
    SELECT employee.id, first_name, last_name, salary, title 
    FROM employee 
    JOIN roles
    ON roles.id = role_id`

    db.query(queryeString, (err, data) => {
        if (err) throw err;

        console.log('\n')
        console.table(data)
        console.log('\n')

        initialize()
    })
}

function addEmp() {
    db.query('SELECT * FROM roles', (err, res) => {
        const roleChoices = res.map(function (res) {
            return { name: res.title, value: res.id };
        });
        db.query('SELECT * FROM employee JOIN roles ON employee.role_id = roles.id', (err, res) => {
            const managerChoices = res.map(function (res) {
                return { name: res.first_name + ' ' + res.last_name + ": " + res.title, value: res.role_id };
            });


            inquirer.prompt([
                { type: 'input', name: 'newEmpFirst', message: '\n New employee`s first name?' },
                { type: 'input', name: 'newEmpLast', message: 'New employee`s last name?' },
                {
                    type: 'list',
                    name: 'newEmpRole',
                    message: 'New employee`s role?',
                    choices: roleChoices
                },
                {
                    type: 'list',
                    name: 'newRoleManager',
                    message: 'Employee`s manager?',
                    choices: managerChoices
                }
            ])
                .then((answers) => {
                    const sql = `insert into employee (first_name, last_name,role_id, manager_id) VALUES ('${answers.newEmpFirst}','${answers.newEmpLast}','${answers.newEmpRole}', '${answers.newRoleManager}' )`

                    db.query(sql, (err, res) => {
                        if (err) throw err;

                        console.log('\n\n\n ** New Employee Added **\n')
                        console.table(answers)


                        initialize()
                    })
                })
        })
    })


}

function addRole() {
    db.query('SELECT * FROM department', (err, res) => {
        const deptChoices = res.map(function (res) {
            console.log(res);
            return { name: res.name, value: res.id };
        });
        inquirer.prompt([
            { type: 'input', name: 'newRoleTitle', message: '\n  Name of the New Role?' },
            { type: 'input', name: 'newRoleSalary', message: ' Salary for the New Role?' },
            {
                type: 'list',
                name: 'newRoleDept',
                message: 'Which department is the new role under?',
                choices: deptChoices
            }

        ])
            .then((answers) => {
                const sql = `insert into roles (title, salary, department_id) VALUES ('${answers.newRoleTitle}','${answers.newRoleSalary}','${answers.newRoleDept}')`

                db.query(sql, (err, res) => {
                    if (err) throw err;

                    console.log('\n\n\n ** New Role Added **\n')
                    console.table(answers)


                    initialize()
                })
            })

    })
}

function addDept() {
    inquirer.prompt([
        { type: 'input', name: 'newDept', message: '\n  Name of the New Department?' }

    ])
        .then((answers) => {
            const sql = `insert into department (name) VALUES ('${answers.newDept}')`

            db.query(sql, (err, res) => {
                if (err) throw err;

                console.log('\n\n\n ** New Department Added **\n')
                console.table(answers)


                initialize()

            })

        })
}

function updateEmpRole() {
    db.query('SELECT * FROM employee', (err, res) => {
        const empChoices = res.map(function (res) {
            return { name: res.first_name, value: res.id };

        });
        db.query('SELECT * FROM roles', (err, res) => {
            const roleChoices = res.map(function (res) {
                return { name: res.title, value: res.id };

            });
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'updateEmp',
                    message: 'Which Employee you like to update?',
                    choices: empChoices
                },
                {
                    type: 'list',
                    name: 'updateRole',
                    message: 'Employee new role ?',
                    choices: roleChoices
                }
            ])
                .then((answers) => {
                    const sql = `
                    UPDATE employee
                    SET role_id = ?
                    WHERE id = ?
                    `

                    db.query(sql, [answers.updateRole, answers.updateEmp], (err, res) => {
                        if (err) throw err;

                        console.log('\n\n\n ** Employee Role updated **\n')
                        console.table(answers)


                        initialize()
                    })
                })
        })
    })
}

function deleteEmp() {
    db.query('SELECT * FROM employee', (err, res) => {
        const empChoices = res.map(function (res) {
            return { name: res.first_name, value: res.id };
        });
        inquirer.prompt([
            { type: 'list', name: 'deleteEmp', message: '\n  Which employee you like to delete?', choices: empChoices }

        ])
            .then((answers) => {
                const sql = `DELETE FROM employee
                WHERE id = ? `

                db.query(sql, [answers.deleteEmp], (err, res) => {
                    if (err) throw err;

                    console.log('\n\n\n ** Employee deleted **\n')
                    console.table(answers)


                    initialize()
                })
            })

    })
}

function quit() {
    process.exit();
}

const longText = 'By Sidd';

console.log(
    logo({
        name: 'Employee Tracker',
        font: 'Speed',
        lineChars: 10,
        padding: 2,
        margin: 3,
        borderColor: 'grey',
        logoColor: 'bold-green',
        textColor: 'green',
    })
    .emptyLine()
    .right('version 3.7.123')
    .emptyLine()
    .center(longText)
    .render()
);