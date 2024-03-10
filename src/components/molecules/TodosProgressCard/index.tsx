import { Card, Progress } from "antd";
import Colors from "@styles/variables.module.sass";

export default function TodosProgressCard({ todos }: Props) {
  const CARD_WIDTH = 670;

  const completedPercentage = () => {
    if (!todos?.length) return 0;
    const totalTodoCount = todos?.length || 0;
    const completedTodoCount = todos?.filter((todo: Todo) => todo.isComplete)?.length || 0;

    return Math.floor((completedTodoCount / totalTodoCount) * 100);
  }

  const getProgressBarColor = () => {
    if (completedPercentage() === 100) return Colors.successColor;
    if (completedPercentage() >= 50) return Colors.warningColor;
    return Colors.errorColor;
  }

  return (
    <Card style={{ width: CARD_WIDTH, marginTop: 20 }}>
      <Progress percent={completedPercentage()} strokeColor={getProgressBarColor()} />
    </Card>
  );
}

type Props = {
  todos: Todo[];
}
