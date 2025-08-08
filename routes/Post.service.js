const {
  getAllPosts,
  getPostById,
  createPost,
  deletePostById,
  updatePostById,
  getUserById,
} = require("../config/connectToSQL");

const getPosts = async (req, res) => {
  const posts = await getAllPosts();
  res.json(posts);
};

const getOnePost = async (req, res) => {
  const { id } = req.params;
  const post = await getPostById(id);
  if (!post) return res.status(404).json({ msg: "Post not found" });
  res.json(post);
};

const createPosts = async (req, res) => {
  const { title, content, user_id } = req.body;
  const user = await getUserById(user_id);
  if (!user) {
    return res.status(404).json({ msg: "user not found" });
  }
  const result = await createPost(title, content, user_id);
  res.status(201).json({ msg: "Post created", result });
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const result = await deletePostById(id);
  res.json({ msg: "Post deleted", result });
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, user_id } = req.body;
  const updated = await updatePostById(id, title, content, user_id);
  if (!updated) return res.status(404).json({ msg: "Post not found" });
  res.json({ msg: "Post updated", updated });
};

module.exports = { getPosts, getOnePost, createPosts, deletePost, updatePost };
