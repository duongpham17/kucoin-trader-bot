import styles from './Style1.module.scss';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement>{
  name: any,
  value?: any,
  size?: any,
  color?: "default" | "white" | "light" | "dark" | "black" | "grey" | "blue" | "red" | "green" | "main"
}

const Style1 = ({name, value, color, size, ...props}:Props) => {
  return (
    <div className={styles.container} {...props} >
      <label className={styles[color || "default"]} style={{fontSize: size}}>{name}</label>
      <span style={{fontSize: size}}>{value}</span>
    </div>
  )
}

export default Style1