"use client"

import { useEffect, useState } from "react";
import { Button, Card, Form, Input, List, Modal, Skeleton, message } from "antd";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSession } from "next-auth/react";
import TextArea from "antd/es/input/TextArea";
import TodoService from "@services/TodoService";
import styles from "./styles.module.sass";

export default function Dashboard() {
  const CARD_WIDTH = 670;

  const { data: session } = useSession();
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();
  const [isBusy, setIsBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [isAddTodoModalOpen, setIsAddTodoModalOpen] = useState(false);

  useEffect(() => {
    getAllTodos();
  }, [])

  const getAllTodos = async () => {
    setIsLoading(true);

    try {
      const response = await TodoService.getAllTodos();

      // TODO :: Handle errors based on response status
      const todos = await response.json();

      setTodos(Array.isArray(todos) ? todos : []);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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

  const deleteTodo = async (todoId: string) => {
    const response = await TodoService.deleteTodo(todoId);
    const deletedTodoId = await response.text();
    const filteredTodos = todos?.filter((t: any) => t._id !== deletedTodoId);
    messageApi.success("Deleted todo");

    setTodos(filteredTodos);
  };

  const renderHeader = () => (
    <>
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
          renderItem={(todo, index) => (
            <List.Item actions={[<Button type="link" danger key="list-delet" onClick={() => deleteTodo(todo._id)}><DeleteOutlined /></Button>]}>
              <Skeleton title={false} loading={isLoading} active>
                <List.Item.Meta
                  title={todo?.todoTitle}
                  description={todo?.todoDescription}
                />
              </Skeleton>
            </List.Item>
          )}
        />
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
    </main>
  );
}
