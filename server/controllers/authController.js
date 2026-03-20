const authModel = require("../models/authModel");

exports.register = async (req, res) => {

  try {

    const user = await authModel.registerUser(req.body);

    res.json({
      message: "User registered successfully",
      user
    });

  } catch (err) {

    res.status(400).json({
      message: err.message
    });

  }

};



exports.login = async (req, res) => {

  try {

    const user = await authModel.loginUser(req.body);

    res.json(user);

  } catch (err) {

    res.status(400).json({
      message: err.message
    });

  }

};