const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');

// const PORT = process.env.PORT || 3001;
// const app = express();

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'iforgot?',
    database: 'employeeDB'
  });
  connection.connect(function (err) {
  console.log(`    
        ╔═══╗─────╔╗──────────────╔═╗╔═╗
        ║╔══╝─────║║──────────────║║╚╝║║
        ║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
        ║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
        ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
        ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
        ───────║║──────╔═╝║─────────────────────╔═╝║
        ───────╚╝──────╚══╝─────────────────────╚══╝`)
        welcomePage();
  });
const welcomePage = () =>{
    inquirer
    .prompt({
        type: 'list',
        name: 'task',
        message: 'What would you like to do?',
        choices: [
            "View Employees",
            // "View Employee by Manager",
            "View Employees by Department",
            "Add Employee",
            // "Remove Employees",
            "Update Employee Role",
            // "Update Employee Managers",
            "Add Role",
            // "Delete Role",
            "View All Departments",
            "Add Department",
            // "Delete Department",
            "Quit"
        ]
    })
    .then(function({task}){
      switch (task) {
        case "View Employees":
          viewEmployee();
          break;
        // case "View Employee by Manager":
        //   viewEmployeeManager();
        //   break;
        // case "View Employees by Department":
        //   viewEmployeeDepartment();
        //   break;
        case "Add Employee":
          addEmployee();
          break;
        // case "Remove Employees":
        //   removeEmployee();
        //   break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "View Role":
          viewRole();
          break;
        case "Add Role":
          addRole();
          break;
        // case "Delete Role":
        //   deleteRole();
        //   break;
        case "View All Departments":
          viewDepartment();
          break;
        case "Add Department":
          addDepartment();
          break;
        // case "Delete Department":
        //   deleteDepartment();
        //   break;
        case "Quit":
          connection.end();
          break;
        }
    });
};

const viewEmployee = () => {
  console.log("Viewing Employees")

  let question =
  `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name, roles.salary, CONCAT(employees.first_name,' ',employees.last_name) AS manager
  FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON departments.id = roles.department_id
  LEFT JOIN employees ON employees.id = employees.manager_id`
  connection.question(question, function (err, res) {
    if (err) throw err;

    console.table(res);
    console.log("Employees viewed.");

    welcomePage();
  });
}

const addEmployee = () => {
  console.log("Adding Employee")

  let question =
  `SELECT roles.id, roles.title, roles.salary 
    FROM role`
  connection.question(question, function (err, res) {
    if (err) throw err;

    const roleChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`
    }));

    console.table(res);
    console.log("Role Insert.");
    insertChoice(roleChoices);
  });
}

const insertChoice = (roleChoices) => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?"
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?"
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices
      }
    ])
    .then(function (answer) {
      let question = `INSERT INTO employees SET`
      connection.question(question,
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.roleId,
          manager_id: answer.managerId,
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.insertedRows + "Added employee");

          welcomePage();
        });
    })
}











