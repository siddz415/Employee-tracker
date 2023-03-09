USE company_db;

INSERT INTO department (name)
VALUES ("Sales"),
("HR"),
("Legal"),
("Engineer"),
("Finance");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Associate", 10000.00, 1),
("Software Developer", 90000.00, 4),
("Recruiter", 90000.00, 2),
("Lawyer", 150000.00, 3),
("Accountant", 110000.00, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Andres", "Long", 2, NULL),
("Cloud", "Husky", 1, 1),
("John", "Doe", 3, NULL),
("Benjamin", "Button", 4, NULL),
("Tim", "Burton", 5, NULL);