import styles from './Style2.module.scss';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement>{
  name: any,
  value?: any,
  size?: string,
  color?: "default" | "white" | "light" | "dark" | "black" | "grey" | "blue" | "red" | "green" | "main"
};

const Style1 = ({name, value, color, size, ...props}:Props) => {
  return (
    <div className={styles.container} {...props} >
      <label>{name}</label>
      <label className={styles[color || "default"]} style={{fontSize: size}}>{value}</label>
    </div>
  )
}

export default Style1