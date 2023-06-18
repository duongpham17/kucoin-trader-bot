import styles from './Style1.module.scss';
import React, {useState} from 'react';
import {MdKeyboardArrowRight} from 'react-icons/md';

interface Props extends React.HTMLAttributes<HTMLDivElement>{
    title: any| React.ReactElement | React.ReactNode,
    small?: string| React.ReactElement | React.ReactNode,
    open?: boolean, 
    selected?: boolean,
    iconOpen?: string | React.ReactElement,
    iconClose?: string | React.ReactElement,
    background?: "light" | "dark",
    section?: React.ReactNode,
    children: React.ReactNode
}

const Style1 = ({title, small, iconOpen, iconClose, section, open=false, children, selected, background, ...props}: Props) => {
    const [isOpen, setisOpen] = useState(open);

    const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation();

    return (
        <div className={`${styles.container} ${styles[selected ? "selected" : "default"]} ${styles[background || ""]}`} {...props} tabIndex={0}>

            <div onClick={() => setisOpen(!isOpen)} className={styles.btn}>
                <div className={styles.header}>
                    <div className={styles.flex}>
                        <p>{title}</p>
                        { (!iconOpen && !iconClose) && <span className={!isOpen ? styles.iconClosed : styles.iconOpen}>{<MdKeyboardArrowRight/> }</span>}
                        { (iconOpen && !iconClose) && iconOpen}
                        { (iconOpen && iconClose) && isOpen ? iconOpen : iconClose}
                    </div>
                    {small && <small>{small}</small>}
                </div>
               {section && 
                    <div className={styles.section}>
                        {section}
                    </div>
                }
            </div>

            {isOpen && 
                <div className={styles.children} onClick={onClick}>
                    {children}
                </div>
            }
            
        </div>
    )
}

export default Style1