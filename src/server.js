require("dotenv").config();
const express = require("express");
const readDb = require("./utils/readFile");
const writeDb = require("./utils/writeFile");
const app = express();
app.use(express.json());

app.get("/users", async (req, res) => {
  let users = await readDb("users.json");
  if (req.query.username) {
    let findUser = users.find(
      (user) =>
        user.username.toLowerCase() === req.query.username.toLowerCase()
    );
    if (!findUser) {
      return res.status(404).json({ message: "User not found", status: 404 });
    }
    return res.json(findUser);
  }
  return res.json(users); 
});

app.get("/users/:id", async (req, res) => {
  let { id } = req.params;
  let users = await readDb("users.json");
  let findUser = users.find((user) => user.id == id);
  if (!findUser) {
    return res.status(404).json({ message: "User not found", status: 404 });
  }
  return res.json(findUser);
});

app.post("/users/create", async (req, res) => {
  let newUser = req.body;
  let users = await readDb("users.json");
  newUser = {
    id: users.length ? users.at(-1).id + 1 : 1,
    ...newUser,
    createdAt: new Date().toLocaleTimeString(),
  };
  users.push(newUser);
  await writeDb("users.json", users);
  return res
    .status(201)
    .json({ message: "User succesfully created", status: 201 });
});
app.put("/users/:id", async (req, res) => {
  let { id } = req.params;
  let users = await readDb("users.json");
  let idx = users.findIndex((user) => user.id == id);
  users[idx] = { ...users[idx], ...req.body };
  await writeDb("users.json", users);
  return res.json({ message: "User succesfully updated", status: 200 });
});
app.delete("/users/:id", async (req, res) => {
  let { id } = req.params;
  let users = await readDb("users.json");
  let idx = users.findIndex((user) => user.id == id);
  if (idx == -1) {
    return res.status(404).json({ message: "User not found", status: 404 });
  }
  users.splice(0, 1);
  await writeDb("users.json", users);
  return res.json({ message: "User succesfully deleted", status: 200 });
});

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
