const mongoose = require('mongoose')

const contributorsSchema = new mongoose.Schema({
    name: { type: String },
    manager: { type: Boolean },
    email: { type: String },
    password: { type: String }
},{
    versionKey: false
})

const contributors = mongoose.model('contributors', contributorsSchema)

module.exports = contributors
