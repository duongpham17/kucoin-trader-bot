import styles from './Round.module.scss';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label1: string | React.ReactNode;
    selected?: boolean,
    loading?: boolean,
    color?: "red" | "dark" | "light" | "black" | "main",
    margin?: boolean,
};

const Button = ({label1, loading, color, selected, margin, ...props}: Props) => {
    return (
        <button type="button" disabled={loading} className={`${styles.container} ${styles[color ? color : "default"]} ${selected && styles.selected} ${margin && styles.margin}`} {...props}>
            {!loading 
                ? <span> { label1 } </span>
                : <div className={styles.loading} />
            }
        </button>   
    )
}

export default Button