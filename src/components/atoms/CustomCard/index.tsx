import styles from "./styles.module.sass";

function CustomCard({ children, width, height, onClick }: any) {
  const isClickable = !!onClick;

  return (
    <div
      className={isClickable ? styles.custom_card_clickable : styles.custom_card}
      style={{ width, height }}
      onClick={onClick || null}
    >
      {children}
    </div>
  )
}

export default CustomCard;
