import Image from "next/image";
import styles from "./styles.module.sass";
import CustomCard from "@components/atoms/CustomCard";
import Link from "next/link";

function IconCard({ text, iconPath, iconSize, url }: any) {
  return (
    <a href={url} target={"_blank"} >
      <CustomCard>
        <Image
          src={iconPath}
          alt={iconPath}
          width={iconSize}
          height={iconSize}
        />
        <label className={styles.icon_card_text}>{text}</label>
      </CustomCard>
    </a>
  )
}

export default IconCard;
