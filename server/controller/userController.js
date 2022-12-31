const User = require("../model/userModel");
const bcrypt = require("bcrypt");
module.exports.register = async (req, res, next) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "username already exist", staus: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "email already exist", staus: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete User.password;
    return res.json({ status: true, user });
  } catch (er) {
    next(er);
  }
};
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};
// module.exports.login = async (req, res, next) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user)
//       return res.json({ msg: "Incorrect Username or Password", status: false });
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid)
//       return res.json({ msg: "Incorrect Username or Password", status: false });
//     delete user.password;
//     return res.json({ status: true, user });
//   } catch (ex) {
//     next(ex);
//   }
// };
