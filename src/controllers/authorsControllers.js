const authorModel = require('../models/authorsModel')
const jwt = require("jsonwebtoken")

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const createAuthor = async function (req, res) {
    try {
        let author = req.body
        if (!isValid(author.fname)) return res.status(400).send({ status: false, msg: "fname is Required" })

        if (!isValid(author.lname)) return res.status(400).send({ status: false, msg: "lname is Required" })

        if (!isValid(author.title)) return res.status(400).send({ status: false, msg: "title is Required" })

        if (!isValid(author.password)) return res.status(400).send({ status: false, msg: "password is Required" })

        if (!isValid(author.email)) return res.status(400).send({ status: false, msg: "email is Required" })

        if (!isemail(author.email)) return res.status(400).send({ status: false, msg: "email is not valid" })

        if (author) {
            let authorCreated = await authorModel.create(author)
            res.status(201).send({ data: authorCreated, msg: "author successfully created" })
        } else res.send(400).send({ msg: "bad request" })
    }
    catch (error) {
        console.log("Server Error:", error.message)
        res.status(500).send({ msg: "Server Error", error: error.message })
    }
}


const authorLogin = async function (req, res) {
    try {
        let emailId = req.body.emailId;
        let password = req.body.password;

        // email is not working
        let user = await authorModel.findOne({ emailId: emailId, password: password });
        if (!user) {
            return res.status(404).send({ status: false, msg: "User Name or the Password is not correct" });
        }

        let token = jwt.sign(
            {
                authorId: user._id.toString(),
                projectName: "Blogging site"
            },
            "room-9"
        );
        res.setHeader("x-api-key", token);
        return res.status(201).send({ status: true, token: token })
    }
    catch (error) {
        console.log("Server Error:", error.message)
        res.status(500).send({ msg: "Server Error", error: error.message })
    }
}

module.exports.createAuthor = createAuthor
module.exports.authorLogin = authorLogin

