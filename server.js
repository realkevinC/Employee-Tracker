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
    password: '',
    database: 'employeesDB'
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
            "View Role",
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

  connection.query(
  `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name, roles.salary, CONCAT(employees.first_name,' ',employees.last_name) AS manager
  FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON departments.id = roles.department_id
  LEFT JOIN employees ON employees.id = employees.manager_id`),
  function (err, result) {
    if (err) 
    throw err;

    console.table(result);
    console.log("Employees viewed.");

    welcomePage();
  };
}

const viewRole = () => {
  connection.query(`SELECT * FROM roles`, 
  function (err, results) {
    console.table(results);
    welcomePage();
})
}

const viewDepartment = () => {
  connection.query(`SELECT * FROM departments`, 
  function (err, results) {
    console.table(results);
    welcomePage();
})
}

const addEmployee = () => {
  console.log("Adding Employee")

  let query =
  `SELECT roles.id, roles.title, roles.salary 
    FROM role`
  connection.query(query, function (err, res) {
    if (err) throw err;

    const roleChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`
    }));

    console.table(res);
    console.log("Role Insert.");
    addEmployeePrompt(roleChoices);
  });
}  

const addEmployeePrompt = (roleChoices) => {
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
        name: "role_id",
        message: "What is the employee's role?",
        choices: roleChoices
      },  
      {
        type: "input",
        name: "manager_id",
        message: "Who is the employee's manager id number"
      }  
    ])  
    .then(function (answer) {
      let query = `INSERT INTO employees SET`
      connection.query(query,
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id,
          manager_id: answer.manager_id,
        },  
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log("Added employee");

          welcomePage();
        });  
    })    
}    

const addRole = () => {
  console.log("Adding Role")
  let query = 
  `SELECT departments.id, departments.name, roles.salary
    FROM employees
    JOIN roles
    ON employees.role_id = roles.id
    JOIN departments
    ON roles.department_id = departments.id`

    connection.query(query, function (err, res) {
      if (err) throw err;
  
      const departmentChoices = res.map(({ id, name }) => ({
        value: id, name: `${id} ${name}`
      }));
  
      console.table(res);
      console.log("Department List");
  
      addRolePrompt(departmentChoices);
    });
}
const addRolePrompt = (departmentChoices) => {
  
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the title of the role"
      },
      {
        type: "input",
        name: "salary",
        message: "What is the role salary"
      },
      {
        type: "list",
        name: "department_id",
        message: "Department?",
        choices: departmentChoices
      }
    ])

    .then(function (answer) {

      let query = `INSERT INTO roles SET`

      connection.query(query, {
        title: answer.title,
        salary: answer.salary,
        department_id: answer.department_id
      },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log("Role Added.");

          firstPrompt();
        });

    });
}
const addDepartment = () => {

    inquirer
    .prompt([
    {
      type: "input",
      name: "department_name",
      message: "What is the new department?"
    }
    ])
    .then(function (answer) {

      let query = `INSERT INTO departments SET`
      connection.query( query, {
        name: answer.name
      },
      function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log("Department Added.");

        firstPrompt();
      })
    });
}










