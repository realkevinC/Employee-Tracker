const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const connect = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'iforgot?',
    database: 'employeeDB'
  },
  console.log(`    
        ╔═══╗─────╔╗──────────────╔═╗╔═╗
        ║╔══╝─────║║──────────────║║╚╝║║
        ║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
        ║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
        ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
        ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
        ───────║║──────╔═╝║─────────────────────╔═╝║
        ───────╚╝──────╚══╝─────────────────────╚══╝`)
);
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
}