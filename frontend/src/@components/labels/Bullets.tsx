import styles from './Bullets.module.scss';
import React from 'react';

interface Props extends React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>{
    text: any[],
    size?: string,
    color?: "default" | "white" | "light" | "dark" | "black" | "grey" | "blue" | "red" | "green" | "main"
};

const Bullets = ({text, size, color, ...props}: Props) => {
  return ( 
    <div className={styles.container}>
      {text.map((el, index) => 
        <label key={index} className={styles[color || "default"]} style={{fontSize: size}}  {...props}>
          { index+1 !== text.length ? <span>{ el} &#x2022; </span> : <span>{el}</span>}
        </label>
      )}
    </div>
  )
}

export default Bullets