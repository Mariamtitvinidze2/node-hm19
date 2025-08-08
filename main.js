const express = require("express");
const {
  getAllProductsAndFilter,
  getProduct,
  productCreator,
  deleteProduct,
  updateProduct,
} = require("./routes/Product.service");
const {
  getUsers,
  userById,
  createNewUser,
  deleteUser,
  updateUser,
} = require("./routes/Users.service");
const {
  getPosts,
  getOnePost,
  createPosts,
  deletePost,
  updatePost,
} = require("./routes/Post.service");
const validateMiddleware = require("./middlewares/validate.middleware");
const userSchema = require("./validations/user.validation");
const postSchema = require("./validations/post.validation");
const app = express();
app.use(express.json());

app.get("/products", getAllProductsAndFilter);
app.get("/products/:id", getProduct);
app.post("/products", productCreator);
app.delete("/products/:id", deleteProduct);
app.put("/products/:id", updateProduct);

app.get("/users", getUsers);
app.get("/users/:id", userById);
app.post("/users", validateMiddleware(userSchema), createNewUser);
app.delete("/users/:id", deleteUser);
app.put("/users/:id", updateUser);

app.get("/posts", getPosts);
app.get("/posts/:id", getOnePost);
app.post("/posts", validateMiddleware(postSchema), createPosts);
app.delete("/posts/:id", deletePost);
app.put("/posts/:id", updatePost);

app.listen(3002, () => {
  console.log("http://localhost:3002");
});
