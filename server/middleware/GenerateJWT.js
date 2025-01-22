const jwt = require("jsonwebtoken");

const TOKEN_SECRET = "3ec5ffef1dd43c135ceb8b78e4a3135a05a982f67a9cca04e4559a84f1d05eaefe4c9bf91d425da0dc6a738cdbd884be59d76466b046f372e5759d3e868305bd";

function generateJWT(payload) {
  const token = jwt.sign(payload, TOKEN_SECRET, { expiresIn: '5h' });
  return token;
}

module.exports = generateJWT;