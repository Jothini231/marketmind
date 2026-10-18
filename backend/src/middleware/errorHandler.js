export const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err.message);

  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid resource identifier format" });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(", ") });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
  });
};
