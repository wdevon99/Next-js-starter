"use client"

import { useState } from "react";
import { Form, Input, Modal, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import TodoService from "@services/TodoService";

export default function CreateTodoModal({ isOpen, setIsOpen, todos, setTodos }: Props) {

  const [form] = Form.useForm();
  const [messageApi] = message.useMessage();
  const [isBusy, setIsBusy] = useState(false);

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
      setIsOpen(false)
      messageApi.success("Added new todo");

    } catch (error) {
      console.error(error);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Modal
      title="Add new todo"
      open={isOpen}
      okText="Add"
      okButtonProps={{ loading: isBusy }}
      onOk={() => createTodo()}
      onCancel={() => {
        form?.resetFields();
        setIsOpen(false)
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
  );
}

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}