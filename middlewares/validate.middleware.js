module.exports = (schema) => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req.body || {}, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((er) => er.message) });
    }
    req.body = value;
    next();
  };
};
