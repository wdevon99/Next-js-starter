import Todo from "@models/todo";
import { connectToDB } from "@utils/database";

export const DELETE = async (request: any) => {
  try {
    await connectToDB();
    const todoId = request.nextUrl.searchParams.get("todoId");
    await Todo.deleteOne({ _id: todoId });

    return new Response(todoId, { status: 200 });
  } catch (error) {
    return new Response("Failed to delete todo", { status: 500 });
  }
};
