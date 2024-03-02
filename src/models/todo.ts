import { Schema, model, models } from "mongoose";

const TodoSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  todoTitle: {
    type: String,
    required: [true, "todoTitle is required."],
  },
  todoDescription: {
    type: String,
    required: [true, "todoDescription is required."],
  },
});

const Todo = models.Todo || model("Todo", TodoSchema);

export default Todo;
