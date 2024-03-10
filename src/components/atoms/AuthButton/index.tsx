import Image from "next/image";
import styles from "./styles.module.sass";
import AUTH_PROVIDERS from "@constants/AuthProviders";

function AuthButton(props: Props) {
  const { text, providername } = props;

  const getButtonClass = () => {
    switch (providername) {
      case AUTH_PROVIDERS.GOOGLE:
        return styles.auth_button_google;
      case AUTH_PROVIDERS.GITHUB:
        return styles.auth_button_github;
      default:
        return styles.auth_button;;
    }
  }

  return (
    <button className={getButtonClass()} {...props}>
      <Image
        src={`/authProviders/${providername?.toLowerCase()}.svg`}
        className={styles.icon}
        height={22}
        width={22}
        alt='Icon'
      />
      {text}
    </button>
  )
}

type Props = {
  text: string,
  providername: string,
  onClick: () => void
}

export default AuthButton;
