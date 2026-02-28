
\c cipher_mini


DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS users;


CREATE TABLE assignments (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  difficulty  VARCHAR(10) DEFAULT 'easy'
);


CREATE TABLE users (
  id     SERIAL PRIMARY KEY,
  name   VARCHAR(100),
  salary INT,
  dept   VARCHAR(100),
  age    INT
);


INSERT INTO assignments (title, description, difficulty) VALUES
  ('Select All Users',       'Write a query to fetch all users from the users table.',                'easy'),
  ('Filter by Salary',       'Get all users who earn more than 50000.',                              'easy'),
  ('Sort by Salary',         'Get all users ordered by salary from highest to lowest.',              'easy'),
  ('Count Users',            'Write a query to count the total number of users.',                    'medium'),
  ('Average Salary',         'Find the average salary of all users.',                                'medium'),
  ('Filter by Department',   'Get all users who work in the Engineering department.',                'medium'),
  ('Max Salary per Dept',    'Find the highest salary in each department.',                          'hard'),
  ('Users Above Average',    'Get users whose salary is above the average salary of all users.',     'hard');




INSERT INTO users (name, salary, dept, age) VALUES
  ('Sumit Tayade',     72000, 'Engineering', 28),
  ('Akshay Sakhare',   45000, 'Marketing',   34),
  ('Prem Tayade',      89000, 'Engineering', 31),
  ('Akshay Tayade',    51000, 'HR',          41),
  ('Khushi Koli',      95000, 'Engineering', 29),
  ('Bhushan Patil',    38000, 'Marketing',   26),
  ('Kiran Shinde',     67000, 'Finance',     35),
  ('Om Bhamre',        55000, 'HR',          44),
  ('Saurabh Chauhan',  82000, 'Finance',     30),
  ('Raaj Chauhary',    49000, 'Marketing',   38);

SELECT 'Database setup complete!' AS result;
