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
            // "View Employees by Department",
            "Add Employee",
            // "Remove Employees",
            "Update Employee",
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
        case "Add Employee":
          addEmployee();
          break;
        // case "Remove Employees":
        //   removeEmployee();
        //   break;
        case "Update Employee":
          updateEmployee();
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
  `SELECT e.id, e.first_name, e.last_name, r.title, d.name, r.salary, CONCAT(m.first_name,' ',m.last_name) AS manager
  FROM employees e
  LEFT JOIN roles r ON e.role_id = r.id
  LEFT JOIN departments d ON d.id = r.department_id
  LEFT JOIN employees m ON m.id = e.manager_id`,
  function (err, result) {
    if (err) 
    throw err;

    console.table(result);
    console.log("Employees viewed.");

    welcomePage();
  });
}

const viewRole = () => {
  connection.query(`SELECT * FROM roles`, 
  function (err, result) {
    console.table(result);
    welcomePage();
})
}

const viewDepartment = () => {
  connection.query(`SELECT * FROM departments`, 
  function (err, result) {
    console.table(result);
    welcomePage();
})
}

const addEmployee = () => {
  console.log("Adding Employee")

  connection.query(
    `SELECT roles.id, roles.title, roles.salary 
      FROM roles`, 
    function (err, result) {
    if (err) throw err;

    const roleChoices = result.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`
    }));

    console.table(result);
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
      connection.query(`INSERT INTO employees SET ?`,
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id,
          manager_id: answer.manager_id,
        },  
        function (err, result) {
          if (err) throw err;

          console.table(result);
          console.log("Added employee");

          welcomePage();
        });  
    })    
}    

const addRole = () => {
  console.log("Adding Role")
    connection.query
    (`SELECT departments.id, departments.name, roles.salary
    FROM employees
    JOIN roles
    ON employees.role_id = roles.id
    JOIN departments
    ON roles.department_id = departments.id`,
     
    function (err, result) {
      if (err) throw err;
  
      const departmentChoices = result.map(({ id, name }) => ({
        value: id, name: `${id} ${name}`
      }));
  
      console.table(result);
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
      connection.query(`INSERT INTO roles SET ?`,
      {
        title: answer.title,
        salary: answer.salary,
        department_id: answer.department_id
      },
        function (err, result) {
          if (err) throw err;

          console.table(result);
          console.log("Role Added.");

          welcomePage();
        });

    });
}
const addDepartment = () => {
console.log("Adding Department")
connection.query

    inquirer
    .prompt([
    {
      type: "input",
      name: "department_name",
      message: "What is the new department?"
    }
    ])
    .then(function (answer) {
      connection.query(`INSERT INTO departments SET ?`,
      {
        name: answer.department_name
      },
      function (err, result) {
        if (err) throw err;

        console.table(result);
        console.log("Department Added.");

        welcomePage();
      })
    });
}

const updateEmployee = () => {
  console.log("Update employee info")

  connection.query
  (`SELECT e.id, e.first_name, e.last_name, r.title, d.name, r.salary, CONCAT(m.first_name,' ',m.last_name) AS manager
  FROM employees e
  LEFT JOIN roles r ON e.role_id = r.id
  LEFT JOIN departments d ON d.id = r.department_id
  LEFT JOIN employees m ON m.id = e.manager_id`,
  function (err, result){
    const selectEmployee = result.map(({ id, first_name, last_name }) => ({
      value: id, name: `${first_name} ${last_name}`      
    }))
    console.table(result);
    newRole(selectEmployee)
  })
}

const newRole = (selectEmployee) => {
  connection.query(
    `SELECT roles.id, roles.title, roles.salary 
      FROM roles`,
  function (err, result){
    let roleChoices= result.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`      
    }));
    console.table(result)

    updateEmployeePrompt(selectEmployee, roleChoices)
  })
}

const updateEmployeePrompt = (selectEmployee, roleChoices) => {
  inquirer
  .prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Select an employee',
      choices: selectEmployee
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Role update list',
      choices: roleChoices
    }
  ])
  .then(function (answer) {
    connection.query(`UPDATE employee SET role_id = ?`,
    [
      answer.employee_id,
      answer.role_id
    ],
    function (err, result){
      console.table(result)

      welcomePage()
    })
  })  
}






