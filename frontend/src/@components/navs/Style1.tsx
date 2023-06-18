import styles from './Style1.module.scss';

interface Props {
    pages: string[],
    selected?: any,
    onClick: (page: string) => void; 
};

const Style1 = ({pages, onClick, selected, ...props}:Props) => {
    return (
        <div className={styles.container} {...props}>
            {pages.map((el, index) => 
                <button className={selected === el ? styles.selected : ""} key={index} onClick={() => onClick(el)}>{el}</button>    
            )}
        </div>
    )
}

export default Style1