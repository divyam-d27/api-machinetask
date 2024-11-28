const express = require("express");
const logMiddleware = require("./logMiddleware");
const app = express();

// 1. Create APIs for:
// - Adding a user (POST /users) with fields: name, email.
// - Adding a task (POST /tasks) with fields: title, description, userId.
// - Fetching all tasks for a specific user (GET /tasks/:userId).
// 2. Data storage: Use an in-memory array (no database required).
// 3. Handle errors for invalid input or non-existing user/task.
// 4. Bonus: Use middleware for logging API calls.

const PORT = 3535;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = [];
const tasks = [];

// method: POST
// route: /users
app.post("/users", logMiddleware, (req, res) => {
  const { name, email } = req.body;

  // vlaidation
  if (!name || !email) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  // check if user already exist
  if (users.some((user) => user.email === email)) {
    return res.status(400).json({ error: "User Already Exist" });
  }

  // creating user document
  const user = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(user);
  res.status(201).json(user);
});

// method: POST
// route: /tasks
app.post("/tasks", logMiddleware, (req, res) => {
  const { title, description, userId } = req.body;

  // validation
  if (!title || !description || !userId) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  // checking for valid user
  const user = users.find((user) => user.id === Number(userId));
  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }

  // creating task
  const task = {
    id: tasks.length + 1,
    title,
    description,
    userId,
  };

  tasks.push(task);
  res.status(201).json(task);
});

// method: GET
// route: /tasks/:userId
app.get("/tasks/:userId", logMiddleware, (req, res) => {
  const { userId } = req.params;

  // user validation
  if (users.some((user) => user.id === Number(userId))) {
    // Filter tasks for the user
    const userTasks = tasks.filter((task) => task.userId === userId);
    res.status(200).json(userTasks);
  } else {
    return res.status(400).json({ error: "User does not exist" });
  }
});

// method: GET
// route: /users
app.get("/users", logMiddleware, (req, res) => {
  res.status(200).json(users);
});

app.get("/", logMiddleware, (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
