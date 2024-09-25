import React from "react";
import styles from "./GameStore.module.css";

const MusicStorePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Game Store</h1>
        <h2 className={styles.subtitle}>Under Construction</h2>
        <p className={styles.message}>
          We're working on bringing you the best gaming titles. Stay tuned!
        </p>
        <div className={styles.icon}>🎵</div>
      </div>
    </div>
  );
};

export default MusicStorePage;
