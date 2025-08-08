const {
  getAllUsers,
  getUserById,
  createUser,
  deleteUserById,
  updateUserById,
} = require("../config/connectToSQL");

const getUsers = async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
};

const userById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ msg: "ID is missing brooo" });

  const user = await getUserById(id);
  if (!user) return res.status(404).json({ msg: "User not found" });

  res.json(user);
};

const createNewUser = async (req, res) => {
  const { name, email } = req.body;
  const result = await createUser(name, email);
  res.status(201).json({ msg: "User created", result });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const result = await deleteUserById(id);
  if (!result) {
    return res.status(404).json({ msg: "User not found" });
  }
  res.json({ msg: "User deleted", result });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const updated = await updateUserById(id, name, email);
  if (!updated) return res.status(404).json({ msg: "User not found" });
  res.json({ msg: "User updated", updated });
};

module.exports = { getUsers, userById, createNewUser, deleteUser, updateUser };
