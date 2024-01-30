import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <div class={styles["lds-ring"]}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}