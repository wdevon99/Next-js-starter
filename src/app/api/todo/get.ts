import Todo from "@models/todo";
import { connectToDB } from "@utils/database";
import { getToken } from "next-auth/jwt";

export const GET = async (request: any) => {
  try {
    const token = await getToken({ req: request });
    const userId = token?.userId;

    await connectToDB();
    const todos = await Todo.find({ creator: userId }).populate("creator");

    return new Response(JSON.stringify(todos), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch todos", { status: 500 });
  }
};
