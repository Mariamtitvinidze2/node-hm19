const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql
  .createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB,
  })
  .promise();

const getAllProducts = async () => {
  const [result] = await pool.query("SELECT * FROM products");
  return result;
};

const getProductById = async (id) => {
  const [result] = await pool.query(
    `
        SELECT * FROM PRODUCTS 
        WHERE ID = ?
        `,
    [id]
  );
  return result[0];
};

const createProduct = async (name, price, available) => {
  const [result] = await pool.query(
    `
        INSERT INTO products (name,price,available)
        VALUE(?,?,?)
        `,
    [name, price, available]
  );

  const insertData = await getProductById(result.insertId);

  return insertData;
};

const deleteById = async (id) => {
  const [result] = await pool.query(
    `
      DELETE FROM products 
      WHERE id = ?
    `,
    [id]
  );
  return result;
};

const updateProductById = async (id, name, price, available) => {
  const existingProduct = await getProductById(id);
  if (!existingProduct) return null;
  const updatedName = name !== undefined ? name : existingProduct.name;
  const updatedPrice = price !== undefined ? price : existingProduct.price;
  const updatedAvailable =
    available !== undefined ? available : existingProduct.available;

  const [result] = await pool.query(
    `
      UPDATE products 
      SET name = ?, price = ?, available = ?
      WHERE id = ?
    `,
    [updatedName, updatedPrice, updatedAvailable, id]
  );

  if (result.affectedRows === 0) return null;

  const updatedProduct = await getProductById(id);
  return updatedProduct;
};

const getFilteredProducts = async (priceFrom, priceTo) => {
  const [res] = await pool.query(
    `    SELECT * FROM products WHERE price BETWEEN ? AND ?
`,
    [priceFrom, priceTo]
  );
  return res;
};

const getOnlyAvailables = async (available) => {
  const [result] = await pool.query(
    `
      SELECT * FROM products
      WHERE available = ?
    `,
    [available]
  );
  return result;
};

const getAllUsers = async () => {
  const [rows] = await pool.query(`
    SELECT 
      users.id AS user_id,
      users.name,
      users.email,
      posts.id AS post_id,
      posts.title,
      posts.content
    FROM users
    LEFT JOIN posts ON posts.user_id = users.id
  `);

  const userInfo = {};

  for (const row of rows) {
    if (!userInfo[row.user_id]) {
      userInfo[row.user_id] = {
        id: row.user_id,
        name: row.name,
        email: row.email,
        posts: [],
      };
    }

    if (row.post_id) {
      userInfo[row.user_id].posts.push({
        id: row.post_id,
        title: row.title,
        content: row.content,
      });
    }
  }

  return Object.values(userInfo);
};

const getUserById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT 
      users.id AS user_id,
      users.name,
      users.email,
      posts.id AS post_id,
      posts.title,
      posts.content
    FROM users
    LEFT JOIN posts ON posts.user_id = users.id
    WHERE users.id = ?
    `,
    [id]
  );

  if (rows.length === 0) return null;

  const user = {
    id: rows[0].user_id,
    name: rows[0].name,
    email: rows[0].email,
    posts: [],
  };

  for (const row of rows) {
    if (row.post_id) {
      user.posts.push({
        id: row.post_id,
        title: row.title,
        content: row.content,
      });
    }
  }

  return user;
};

const createUser = async (name, email) => {
  const [result] = await pool.query(
    `INSERT INTO users (name, email) VALUES (?, ?)`,
    [name, email]
  );
  return await getUserById(result.insertId);
};

const deleteUserById = async (id) => {
  const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
  return result;
};

const updateUserById = async (id, name, email) => {
  const existing = await getUserById(id);
  if (!existing) return null;
  const updatedName = name !== undefined ? name : existing.name;
  const updatedEmail = email !== undefined ? email : existing.email;

  const [result] = await pool.query(
    `UPDATE users SET name = ?, email = ? WHERE id = ?`,
    [updatedName, updatedEmail, id]
  );
  return await getUserById(id);
};

const getAllPosts = async () => {
  const [result] = await pool.query(
    `SELECT posts.id, posts.title, posts.content, users.name, users.email
     FROM posts
     LEFT JOIN users ON posts.user_id = users.id`
  );
  return result;
};

const getPostById = async (id) => {
  const [result] = await pool.query("SELECT * FROM posts WHERE id = ?", [id]);
  return result[0];
};

const createPost = async (title, content, user_id) => {
  const [result] = await pool.query(
    `INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)`,
    [title, content, user_id]
  );
  return await getPostById(result.insertId);
};

const deletePostById = async (id) => {
  const [result] = await pool.query("DELETE FROM posts WHERE id = ?", [id]);
  return result;
};

const updatePostById = async (id, title, content, user_id) => {
  const existing = await getPostById(id);
  if (!existing) return null;
  const updatedTitle = title !== undefined ? title : existing.title;
  const updatedContent = content !== undefined ? content : existing.content;
  const updatedUserId = user_id !== undefined ? user_id : existing.user_id;

  const [result] = await pool.query(
    `UPDATE posts SET title = ?, content = ?, user_id = ? WHERE id = ?`,
    [updatedTitle, updatedContent, updatedUserId, id]
  );
  return await getPostById(id);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteById,
  updateProductById,
  getFilteredProducts,
  getOnlyAvailables,
  getAllUsers,
  getUserById,
  createUser,
  deleteUserById,
  updateUserById,
  getAllPosts,
  getPostById,
  createPost,
  deletePostById,
  updatePostById,
};
