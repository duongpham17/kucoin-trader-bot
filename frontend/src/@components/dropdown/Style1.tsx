import styles from './Style1.module.scss';
import React from 'react';

interface Props {
  children: React.ReactNode,
  button: React.ReactNode,
  right?: boolean 
}

const Dropdown = ({children, button, right}:Props) => {
    return (
      <div className={`${styles.container} ${!right ? styles.middle : ""}`}>
  
        <button className={styles.button}>{button}</button>
        
        <div className={`${styles.dropdown} ${right ? styles.right : ""}`}>
          {children}
        </div>
        
      </div>
    )
};

export default Dropdown