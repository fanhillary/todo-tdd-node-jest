let TodoModel = require("../model/todo.model");

exports.createTodo = (req, res) => {
    const result = TodoModel.create(req.body);
    res.status(201).json(result);
};