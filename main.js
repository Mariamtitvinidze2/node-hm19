const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteById,
  updateProductById,
  getFilteredProducts,
  getOnlyAvailables,
} = require("./config/connectToSQL");
const app = express();
app.use(express.json());

app.get("/products", async (req, res) => {
  const { priceFrom, priceTo, available } = req.query;
  if (priceFrom || priceTo) {
    const filtered = await getFilteredProducts(priceFrom, priceTo);
    return res.json(filtered);
  }
  if (available) {
    let num = 0;
    if (available === "true") {
      num = 1;
    } else if (available === "false") {
      num = 0;
    }
    const isAvailable = await getOnlyAvailables(num);
    return res.json(isAvailable);
  }
  const rep = await getAllProducts();
  res.json(rep);
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ msg: "ID is missing brooo" });
  }
  const result = await getProductById(id);
  res.json(result);
});

app.post("/products", async (req, res) => {
  const { name, price, available } = req.body;
  if (!name || !price || !available) {
    return res.status(400).json({ msg: "Required fields are missing brooo" });
  }
  const result = await createProduct(name, price, available);
  if (!result) {
    return res.status(404).json({ msg: "Product not found" });
  }
  res.status(201).json({ msg: "created successfully" });
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ msg: "ID is missing brooo" });
  }
  const result = await deleteById(id);
  res.json({ msg: "Product deleted successfully" });
});
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ msg: "ID is missing brooo" });
  }
  const { name, price, available } = req.body;

  const updated = await updateProductById(id, name, price, available);
  if (!updated) {
    return res.status(404).json({ msg: "Product not" });
  }
  res.json({ msg: "Product updated successfully" });
});

app.listen(3002, () => {
  console.log("http://localhost:3002");
});
