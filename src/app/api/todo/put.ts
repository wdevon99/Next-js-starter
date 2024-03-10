import Todo from "@models/todo";
import { connectToDB } from "@utils/database";

export const PUT = async (request: any) => {
  try {
    await connectToDB();
    const todoId = request.nextUrl.searchParams.get("todoId");
    const isComplete = request.nextUrl.searchParams.get("isComplete");
    const updatedTodo = await Todo.findOneAndUpdate({ _id: todoId }, { $set: { isComplete } }, { new: true });

    return new Response(JSON.stringify(updatedTodo), { status: 200 });
  } catch (error) {
    return new Response("Failed to update todo", { status: 500 });
  }
};
