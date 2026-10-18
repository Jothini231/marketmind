import User from "../models/User.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ _id: 1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};
