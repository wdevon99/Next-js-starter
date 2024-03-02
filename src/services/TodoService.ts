// TODO :: Handle typing

const createTodo = async (todoTitle: string, todoDescription: string) => {
  return await fetch("/api/todo", {
    method: "POST",
    body: JSON.stringify({ todoTitle, todoDescription }),
  });
};

const getAllTodos = async () => {
  return await fetch("/api/todo", {
    method: "GET",
  });
};

const deleteTodo = async (todoId: string) => {
  return await fetch(`/api/todo?todoId=${todoId}`, {
    method: "DELETE",
  });
};

const TodoService = {
  createTodo,
  getAllTodos,
  deleteTodo,
};

export default TodoService;
