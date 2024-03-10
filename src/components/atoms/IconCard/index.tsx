import Image from "next/image";
import styles from "./styles.module.sass";
import { Card, Flex } from "antd";

function IconCard({ text, iconPath, iconSize, url }: Props) {
  return (
    <a href={url} target={"_blank"}>
      <Card style={{ width: 120, margin: 10 }}>
        <Flex vertical={true} align="center">
          <Image
            src={iconPath}
            alt={iconPath}
            width={iconSize}
            height={iconSize}
          />
          <label className={styles.icon_card_text}>{text}</label>
        </Flex>
      </Card>
    </a>
  )
}

type Props = {
  text: string,
  iconPath: string,
  iconSize: number,
  url: string
}

export default IconCard;
