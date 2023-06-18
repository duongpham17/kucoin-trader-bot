import styles from './Button.module.scss';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label1: string | React.ReactNode;
    label2?: string | React.ReactNode;
    selected?: boolean,
    loading?: boolean,
    color?: "red" | "dark" | "light" | "black" | "main" | "blue" | "plain",
    margin?: boolean,
};

const Button = ({label1, label2, loading, color, selected, margin, ...props}: Props) => {
    return (
        <div className={styles.container}>

            <button type="button" disabled={loading} className={`${styles[color ? color : "default"]} ${selected && styles.selected} ${margin && styles.margin}`} {...props}>

                { label1 && !label2 && 
                    <div className={styles.single}>  
                        {!loading && <span> { label1 } </span>}
                        {loading && <div className={styles.loading1} />}
                    </div>
                }

                { label1 && label2 && 
                    <div className={styles.double}>  
                        <span>{ label1 } </span>
                        {!loading && <span>{ label2 }</span>}
                        {loading && <div className={styles.loading2} />}
                    </div> 
                }

            </button>   
            
        </div>
    )
}

export default Button