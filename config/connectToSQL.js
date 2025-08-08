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
  const [result] = await pool.query(
    `
      UPDATE products 
      SET name = ?, price = ?, available = ?
      WHERE id = ?
    `,
    [name, price, available, id]
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

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteById,
  updateProductById,
  getFilteredProducts,
  getOnlyAvailables,
};
