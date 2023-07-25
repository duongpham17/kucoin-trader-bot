import styles from './Select.module.scss';
import React, {useState} from 'react';
import {MdOutlineKeyboardArrowRight} from 'react-icons/md';

interface Props{
    label1?: any;
    label2?: any;
    error?: any,
    selected: any,
    items: string[];
    color?: "plain" | "dark" | "light",
    onClick: (item: string) => void;
};

const Select = ({label1, label2, color, error, items, selected, onClick}: Props) => {

    const [open, setOpen] = useState(false);

    const onPrevent = (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(!open)
    };

    return (
        <div className={styles.container} onClick={onPrevent}>

            <label>{label1}</label>

            <div className={`${styles.select} ${error ? styles.error : ""} ${styles[color || "light"]}`}>

                <button className={styles.button} onClick={onPrevent}>
                    <p>{selected}</p>
                    <div>
                        {label2 && <span>{label2}</span>}
                        <MdOutlineKeyboardArrowRight className={open ? styles.open : styles.closed}/>
                    </div>
                </button>

                {open && 
                    <ul>
                        { items.map((el, index) => 
                            <li className={styles.item} key={(el+index)}>
                                <button className={selected === el ? styles.selected : ""} onClick={() => onClick(el)}>
                                    <span>{el}</span>
                                    <span className={styles.arrow}>&#8592;</span>
                                </button>
                            </li>    
                        )}
                    </ul>
                }

            </div>

        </div>
    )
}

export default Select