const jwt = require("jsonwebtoken");
const { query, pool } = require('../config/data_base');
const TOKEN_SECRET = "3ec5ffef1dd43c135ceb8b78e4a3135a05a982f67a9cca04e4559a84f1d05eaefe4c9bf91d425da0dc6a738cdbd884be59d76466b046f372e5759d3e868305bd";

const verifyJWT = async (req, res, next) => {
    const token = req.headers['authorization'] || ['authorization'];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        const stored_user = await query(select * from users where id = ${user.id});
        
        if (!stored_user[0]) return res.status(404).json({ message: "user did not login !" });

        req.user = stored_user[0];

        next();
    });
};

module.exports = verifyJWT;
