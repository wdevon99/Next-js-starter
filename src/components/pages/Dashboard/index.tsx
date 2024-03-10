"use client"

import { useEffect, useState } from "react";
import { FloatButton } from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TodoService from "@services/TodoService";
import CustomAvatar from "@components/atoms/CustomAvatar";
import styles from "./styles.module.sass";
import TodosCard from "@components/molecules/TodosCard";
import CreateTodoModal from "@components/molecules/CreateTodoModal";
import TodosProgressCard from "@components/molecules/TodosProgressCard";

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = useSession();

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

  return (
    <main className={styles.container}>
      <CustomAvatar
        image={session?.user?.image || ''}
        size={60}
      />
      <h1 className={styles.heading}>
        Hi {session?.user?.name?.split(' ')?.[0]} :)
      </h1>
      <h2 className={styles.sub_heading}>
        Track your todos with ease.
      </h2>
      <TodosCard
        todos={todos}
        setTodos={setTodos}
        setIsAddTodoModalOpen={setIsAddTodoModalOpen}
        isLoading={isLoading}
      />
      <TodosProgressCard
        todos={todos}
      />
      <CreateTodoModal
        isOpen={isAddTodoModalOpen}
        setIsOpen={setIsAddTodoModalOpen}
        todos={todos}
        setTodos={setTodos}
      />
      <FloatButton
        icon={<ArrowLeftOutlined />}
        style={{ left: 30, top: 30 }}
        onClick={() => router.push('/')}
      />
    </main>
  );
}

