const mongoose = require('mongoose')

const tasksSchema = new mongoose.Schema({
    id : { type : Number },
    description: { type: String },
    inclusionDate: { type: String },
    deadline: { type: String },
    completed: { type: Boolean },
    contributorName: { type: String }
},{
    versionKey: false
})

const tasks = mongoose.model('tasks', tasksSchema)

module.exports = tasks
