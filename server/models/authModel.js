const { User } = require("./schema");

exports.registerUser = async (data) => {

  const { name, email, password, role } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const user = new User({
    name,
    email,
    password,
    role
  });

  await user.save();

  return user;
};



exports.loginUser = async (data) => {

  const { email, password } = data;

  const user = await User.findOne({
    email,
    password
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  return user;
};