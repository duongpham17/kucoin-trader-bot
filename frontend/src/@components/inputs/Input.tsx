import styles from './Input.module.scss';
import React from 'react';

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    label1?: string | number, 
    label2?: string | number | React.ReactNode,
    error?: boolean,
    borderBottom?: boolean
};

const Input = ({label1, label2, error, borderBottom, ...props}:Props) => {
    
  return (
    <div className={styles.container}>

        {label1 && !label2 && 
            <label className={styles.single}>
                <span>{label1}</span>
            </label>
        }

        {label1 && label2 && 
            <label className={styles.double}> 
                <span>{label1}</span>
                <small>{label2}</small>
            </label>
        }

        <input {...props} className={`${borderBottom ? styles.borderBottom : styles.border} ${error ? styles.error : ""}` } />

    </div>
  )
}

export default Input