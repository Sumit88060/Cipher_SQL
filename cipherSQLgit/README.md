# CipherSQL Mini

Pick a task, write a query, run it, and see what happens. That’s it.

No heavy setup, no clutter—just the basics to get comfortable with SQL.

---

## Project Structure

```
cipher-mini/
├── backend/
│   ├── db.js        # PostgreSQL connection
│   ├── server.js    # All routes live here (yeah, just one file)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx  # Whole frontend in one file (kept simple)
│   │   └── App.css
│   ├── index.html
│   └── package.json
├── setup.sql        # Run this first to create tables/data
└── package.json     # Root config to run both sides together
```

---

## Getting Started

### 1. Create the database

Make sure PostgreSQL is running, then:

```
psql -U postgres -f setup.sql
```

If this fails, double-check your username/password or PATH setup.

---

### 2. Install dependencies

From the root folder:

```
npm install
npm run install:all
```

This installs both backend and frontend stuff in one go.

---

### 3. Run the app

```
npm run dev
```

This starts both servers together (backend + frontend).

---

### 4. Open in browser

```
http://localhost:5174
```

If the port is busy, it might shift—check your terminal.

---

## API Routes

| Method | Endpoint       | Description                |
| ------ | -------------- | -------------------------- |
| GET    | /assignments   | Get all SQL exercises      |
| GET    | /sample-data   | Returns first 5 users      |
| POST   | /execute-query | Runs whatever SQL you send |

---

## Sample Queries to Try

```
SELECT * FROM users;

SELECT * FROM users WHERE salary > 50000;

SELECT * FROM users ORDER BY salary DESC;

SELECT COUNT(*) FROM users;

SELECT dept, MAX(salary) FROM users GROUP BY dept;
```


---

If something breaks, it’s probably:

* PostgreSQL not running
* wrong credentials
* or you forgot to run setup.sql

---

That should be enough to get going.
