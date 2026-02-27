exports.isEmail = (email) => /\S+@\S+\.\S+/.test(email);
exports.isNonEmptyString = (str) => typeof str === "string" && str.trim().length > 0;
exports.isPositiveNumber = (num) => typeof num === "number" && num > 0;

exports.validateUser = ({ name, email, password, role }) => {
  if (!exports.isNonEmptyString(name)) throw new Error("Name is required");
  if (!exports.isEmail(email)) throw new Error("Invalid email");
  if (!exports.isNonEmptyString(password)) throw new Error("Password is required");
  if (!exports.isNonEmptyString(role)) throw new Error("Role is required");
};