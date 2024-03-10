"use client"

import { Button, Card, List, Skeleton, message } from "antd";
import { PlusOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import TodoService from "@services/TodoService";
import styles from "./styles.module.sass";

export default function TodosCard({ todos, setTodos, setIsAddTodoModalOpen, isLoading }: Props) {
  const CARD_WIDTH = 670;
  const [messageApi, contextHolder] = message.useMessage();

  const updateTodoStatus = async (todoId: string, isComplete: boolean) => {
    const response = await TodoService.updateTodoStatus(todoId, !isComplete);
    const updatedTodo: Todo = await response.json();
    const updatedTodos = todos?.map((todo: Todo) => todo._id.toString() === updatedTodo._id.toString() ? updatedTodo : todo);

    messageApi.success(updatedTodo.isComplete ? "Completed todo 🎉" : "Undo success");
    setTodos(updatedTodos);
  };

  const deleteTodo = async (todoId: string) => {
    const response = await TodoService.deleteTodo(todoId);
    const deletedTodoId = await response.text();
    const filteredTodos = todos?.filter((t: any) => t._id !== deletedTodoId);

    messageApi.success("Deleted todo");
    setTodos(filteredTodos);
  };

  const getListItemActions = (todo: Todo) => [
    <Button type={todo.isComplete ? 'dashed' : 'dashed'} key="done" onClick={() => updateTodoStatus(todo._id, todo.isComplete)}>
      {todo.isComplete ? <UndoOutlined /> : 'Complete'}
    </Button>,
    <Button type="dashed" danger key="delete" onClick={() => deleteTodo(todo._id)}>
      <DeleteOutlined />
    </Button>
  ]

  return (
    <section>
      {contextHolder}
      <Card
        title={`Here are your todos`}
        extra={<Button type="primary" size="small" shape="circle" onClick={() => setIsAddTodoModalOpen(true)}><PlusOutlined /></Button>}
        style={{ width: CARD_WIDTH }}
      >
        <List
          className={styles.list}
          loading={isLoading}
          itemLayout="horizontal"
          loadMore={null}
          dataSource={todos}
          renderItem={(todo: Todo) => (
            <List.Item actions={getListItemActions(todo)}>
              <Skeleton title={false} loading={isLoading} active>
                <List.Item.Meta
                  title={<span className={todo.isComplete ? styles.completedTodoText : ''}>{todo?.todoTitle}</span>}
                  description={<span className={todo.isComplete ? styles.completedTodoText : ''}>{todo?.todoDescription}</span>}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </Card>
    </section>
  );
}

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setIsAddTodoModalOpen: (isOpen: boolean) => void;
  isLoading: boolean;
}