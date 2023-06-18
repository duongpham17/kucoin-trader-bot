import styles from './Style1.module.scss';
import React, {useState} from 'react';
import {MdOutlineKeyboardArrowRight} from 'react-icons/md';

interface Props{
    label?: any;
    selected: any,
    items: string[] | number[];
    color?: "plain" | "dark" | "light",
    onClick: (item: string | number) => void;
};

const Select = ({label, color, items, selected, onClick}: Props) => {

    const [open, setOpen] = useState(false);

    const onPrevent = (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(!open)
    };

    return (
        <div className={`${styles.container} ${styles[color || "light"]}`} onClick={onPrevent}>

            <button className={styles.button} onClick={onPrevent}>
                <p>{selected}</p>
                <div>
                    {label && <span>{label}</span>}
                    <MdOutlineKeyboardArrowRight className={open ? styles.open : styles.closed}/>
                </div>
            </button>

            {open && 
                <ul>
                    { items.map((el, index) => 
                        <li className={styles.item} key={(el.toString()+index)}>
                            <button className={selected ? styles.selected : ""} onClick={() => onClick(el)}>
                                <span>{el}</span>
                                <span className={styles.arrow}>&#8592;</span>
                            </button>
                        </li>    
                    )}
                </ul>
            }

        </div>
    )
}

export default Select