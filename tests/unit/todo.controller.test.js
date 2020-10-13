const { expect } = require("@jest/globals");
const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");

TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findOne = jest.fn();

let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
})

describe('TodoController.createTodo', () => {
    beforeEach(() => {
        req.body = newTodo;
    })
    it("should have a createTodo function", () => {
        expect(typeof TodoController.createTodo).toBe("function");
    })
    it("should call TodoModel.create", async () => {
        await TodoController.createTodo(req, res, next);
        expect(TodoModel.create).toBeCalledWith(newTodo);
    })

    it ('should return 201 response code on create', async () => {
        await TodoController.createTodo(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    })

    it ('should return json body in response', async () => {
        TodoModel.create.mockReturnValue(newTodo);
        await TodoController.createTodo(req, res, next);
        expect(res._getJSONData()).toEqual(newTodo);
    })

    it ('should return error if missing request key', async () => {
        const errorMessage = { message: "Done property missing"};
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.create.mockReturnValue(rejectedPromise);
        await TodoController.createTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    })
});

describe('TodoController.getTodos', () => {
    it("should have a getTodo function", () => {
        expect(typeof TodoController.getTodos).toBe("function");
    });
    it("should call find to grab todo collection", async () => {
        await TodoController.getTodos(req, res, next);
        expect(TodoModel.find).toHaveBeenCalled();
    });

    it ("should return list of all todos", async () => {
        TodoModel.find.mockReturnValue([newTodo]);
        await TodoController.getTodos(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual([newTodo]);
    });

    it ("should handle errors", async () => {
        const errorMessage = { message: "GET Todo error" };
        TodoModel.find.mockReturnValue(Promise.reject(errorMessage));
        await TodoController.getTodos(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe("TodoController.getTodoById", () => {
    it ('should have a getTodoTodoById function', () => {
        expect(typeof TodoController.getTodoById).toBe("function");
    });

    it ('should call TodoModel findOne for given id', async () => {
        const id = {"id" : "1234"}
        req.params = id;
        await TodoController.getTodoById(req, res, next);
        expect(TodoModel.findOne).toHaveBeenCalledWith(id);
    });

    it ('should respond with todo for given id', async () => {
        const id = {"id" : "1234"}
        TodoModel.findOne.mockReturnValue(newTodo);
        req.params = id;
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(newTodo);
    });

    it ("should catch errors", async () => {
        const errorMessage = { message: "Cannot find ID"};
        TodoModel.findOne.mockReturnValue(Promise.reject(errorMessage));
        await TodoController.getTodoById(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
})