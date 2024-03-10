import { Avatar } from "antd";
import styles from "./styles.module.sass";
import Image from "next/image";

function CustomAvatar({ size = 'large', image, mainText, subText }: Props) {

  const renderLabels = () => {
    if (!mainText && !subText) return;

    return (
      <div className={styles.label_container}>
        <label className={styles.main_text}>{mainText}</label>
        <label className={styles.sub_text}>{subText}</label>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Avatar
        src={<Image src={image} height={300} width={300} alt='Avatar' />}
        size={size}
      />
      {renderLabels()}
    </div>
  )
}

type Props = {
  size?: 'large' | 'small' | 'default' | number,
  image: string,
  mainText?: string,
  subText?: string
}

export default CustomAvatar;
