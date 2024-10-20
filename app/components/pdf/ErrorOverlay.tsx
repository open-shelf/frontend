import React from "react";
import styles from "./pdf-viewer.module.css";

const ErrorOverlay = ({ message }) => (
  <div className={styles.errorOverlay}>{message}</div>
);

export default ErrorOverlay;
