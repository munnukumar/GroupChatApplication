const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const database = require("../util/database");
const User = require("../models/user");

exports.postSignup = async (req, res, next) => {
    const t = await database.transaction();
    try {
        const { name, email, phone, password } = req.body;
        const modifiedPassword = await bcrypt.hash(password, 10);
        await User.create({ name: name, email: email, phone: phone, password: modifiedPassword });
        await t.commit();
        res.status(200).json({ message: 'User created successfully' });
    }
    catch (err) {
        console.error(err.errors[0].message);
        await t.rollback();
        res.status(500).json({ error: err.errors[0].message });
    }
};;

function generateAccessToken(id, email) {
    return jwt.sign({ id: id, email: email }, process.env.ACCESS_TOKEN_SECRET);
}

exports.postLogin = async (req, res, next) => {
    const t = await database.transaction();
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }
      
        await t.commit();
        res.status(200).json({ message: 'User successfully Logged In', token: generateAccessToken(user.id, user.email) });
    }
    catch (err) {
        await t.rollback();
        if (err.statusCode != 500) {
            res.status(err.statusCode).json({ error: err.message });
        }
        else {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};