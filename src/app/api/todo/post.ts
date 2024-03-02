import Todo from "@models/todo";
import { connectToDB } from "@utils/database";
import { getToken } from "next-auth/jwt";

export const POST = async (request: any) => {
  const token = await getToken({ req: request });
  const userId = token?.userId;

  const { todoTitle, todoDescription } = await request.json();

  try {
    await connectToDB();
    const newTodo = new Todo({ creator: userId, todoTitle, todoDescription });
    await newTodo.save();
    return new Response(JSON.stringify(newTodo), { status: 200 });
  } catch (error) {
    return new Response("Failed to create a new todo", { status: 500 });
  }
};
