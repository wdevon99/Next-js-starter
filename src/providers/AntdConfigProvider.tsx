import { ConfigProvider } from "antd";
import Colors from "@styles/variables.module.sass";

const AntdConfigProvider = ({ children }: Props) => {
  const THEME = {
    token: {
      colorPrimary: Colors.primaryColor,
    },
  }

  return (
    <ConfigProvider theme={THEME}>
      {children}
    </ConfigProvider>
  )
}

type Props = {
  children: React.ReactNode,
}

export default AntdConfigProvider;
