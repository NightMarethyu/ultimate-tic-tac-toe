const bcrypt = require("bcryptjs");
const saltRounds = 10;

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    console.error("Hashing error: ", err);
    throw err;
  }
}

module.exports = hashPassword;
