const mongoose = require("mongoose");

async function connect() {
    try {
        await mongoose.connect("mongodb+srv://todo-admin:todo-password@cluster0.0tzc2.mongodb.net/TODO-TDD?retryWrites=true&w=majority",
        { useNewUrlParser: true , useUnifiedTopology: true});
    } catch (err) {
        console.error("error connecting to mongodb");
        console.error(err);
    }
}

module.exports = { connect };