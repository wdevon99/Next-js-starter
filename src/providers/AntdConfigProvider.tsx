import { ConfigProvider, theme } from "antd";

const AntdConfigProvider = ({ children, session }: any) => {
  const THEME = {
    token: {
      colorPrimary: '#292929', // TODO :: Store colors in constants
    },
  }

  return (
    <ConfigProvider theme={THEME}>
      {children}
    </ConfigProvider>
  )
}

export default AntdConfigProvider;
