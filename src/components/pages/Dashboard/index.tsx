"use client"

import { useEffect, useState } from "react";
import { Button, Card, FloatButton, Form, Input, List, Modal, Progress, Skeleton, message } from "antd";
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined, UndoOutlined } from '@ant-design/icons';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TextArea from "antd/es/input/TextArea";
import TodoService from "@services/TodoService";
import CustomAvatar from "@components/atoms/CustomAvatar";
import Colors from "@styles/variables.module.sass";
import styles from "./styles.module.sass";

export default function Dashboard() {
  const CARD_WIDTH = 670;

  const router = useRouter();
  const { data: session } = useSession();
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();
  const [isBusy, setIsBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAddTodoModalOpen, setIsAddTodoModalOpen] = useState(false);

  useEffect(() => {
    getAllTodos();
  }, [])

  const getAllTodos = async () => {
    setIsLoading(true);

    try {
      const response = await TodoService.getAllTodos();
      const todos: Todo = await response.json();
      setTodos(Array.isArray(todos) ? todos : []);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const createTodo = async () => {
    setIsBusy(true);

    try {
      const values = await form?.validateFields();
      const { todoTitle, todoDescription } = values;

      const response = await TodoService.createTodo(todoTitle, todoDescription);
      const newTodo = await response.json();
      const updatedTodos: any = [...(todos ?? []), newTodo];

      setTodos(updatedTodos);
      form?.resetFields();
      setIsAddTodoModalOpen(false)
      messageApi.success("Added new todo");

    } catch (error) {
      console.error(error);
    } finally {
      setIsBusy(false);
    }
  };

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

  const completedPercentage = () => {
    if (!todos?.length) return 0;
    const totalTodoCount = todos?.length;
    const completedTodoCount = todos?.filter((todo: Todo) => todo.isComplete)?.length;

    return Math.floor((completedTodoCount / totalTodoCount) * 100);
  }

  const getProgressBarColor = () => {
    if (completedPercentage() === 100) return Colors.successColor;
    if (completedPercentage() >= 50) return Colors.warningColor;
    return Colors.errorColor;
  }

  const renderHeader = () => (
    <>
      <CustomAvatar
        image={session?.user?.image}
        size={60}
      />
      <h1 className={styles.heading}>Hi {session?.user?.name?.split(' ')?.[0]} :)</h1>
      <h2 className={styles.sub_heading}>Track your todos with ease.</h2>
    </>
  )

  return (
    <main className={styles.container}>
      {contextHolder}
      {renderHeader()}
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
            <List.Item
              actions={[
                <Button type={todo.isComplete ? 'dashed' : 'dashed'} key="done" onClick={() => updateTodoStatus(todo._id, todo.isComplete)}>
                  {todo.isComplete ? <UndoOutlined /> : 'Complete'}
                </Button>,
                <Button type="dashed" danger key="delete" onClick={() => deleteTodo(todo._id)}>
                  <DeleteOutlined />
                </Button>
              ]}
            >
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
      <Card style={{ width: CARD_WIDTH, marginTop: 20 }}>
        <Progress percent={completedPercentage()} strokeColor={getProgressBarColor()} />
      </Card>
      <Modal
        title="Add new todo"
        open={isAddTodoModalOpen}
        okText="Add"
        okButtonProps={{ loading: isBusy }}
        onOk={() => createTodo()}
        onCancel={() => {
          form?.resetFields();
          setIsAddTodoModalOpen(false)
        }}
      >
        <p>What would you like to add to you todo list?</p>
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="todoTitle"
            rules={[{ required: true, message: 'Todo title is required!' }]}
          >
            <Input placeholder="Todo title" />
          </Form.Item>
          <Form.Item
            name="todoDescription"
            rules={[{ required: true, message: 'Todo description is required!' }]}
          >
            <TextArea rows={4} placeholder="Todo description" />
          </Form.Item>
        </Form>
      </Modal>
      <FloatButton
        icon={<ArrowLeftOutlined />}
        style={{ left: 30, top: 30 }}
        onClick={() => router.push('/')}
      />
    </main>
  );
}
