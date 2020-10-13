const TodoModel = require("../model/todo.model");

exports.createTodo = async (req, res, next) => {
    try {
        const result = await TodoModel.create(req.body);
        res.status(201).json(result);
    } catch(err) {
        next(err);
    }
};

exports.getTodos = async (req, res, next) => {
    try {
        let todos = await TodoModel.find();
        res.status(200).json(todos);
    } catch (err) {
        next(err);
    }
};

exports.getTodo = async (req, res, next) => {
    try {
        let todo = await TodoModel.findOne({"id": req.params.id});
        res.status(200).json(todo);
    } catch (err) {
        next(err);
    }
}