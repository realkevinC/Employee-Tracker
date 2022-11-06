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
            "View Employee by Manager",
            "View Employees by Department",
            "Add Employee",
            "Remove Employees",
            "Update Employee Role",
            "Update Employee Managers",
            "Add Role",
            "Delete Role",
            "View All Departments",
            "Add Department",
            "Delete Department",
            "Quit"
        ]
    })
    .then(function({task}){
      switch (task) {
        case "View Employees":
          viewEmployee();
          break;
        case "View Employee by Manager":
          viewEmployeeManager();
          break;
        case "View Employees by Department":
          viewEmployeeDepartment();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employees":
          removeEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Update Employee Managers":
          updateEmployeeManager();
          break;
        case "Add Role":
          addRole();
          break;
        case "Delete Role":
          deleteRole();
          break;
        case "View All Departments":
          viewDepartment();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Delete Department":
          deleteDepartment();
          break;
        case "Quit":
          connection.end();
          break;
        }
    });
};