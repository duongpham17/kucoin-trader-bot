import styles from './Style1.module.scss';
import {useState} from 'react';

interface Props {
    src: string[],
}

const Style1 = ({src}: Props) => {

    const randomid = (): string => {
        const id = Math.random().toString(36).substring(7);
        return id;
    };
    
    const generateid = (times: number = 2): string => {
        const id = Array.from({length: times}, () => randomid()).join("");
        return id
    };

    const [selected, setSelected] = useState(src[0]);

    return (
        <div className={styles.container}>

            <div className={styles.small}>
                {src.map(el => 
                    <img className={selected === el ? styles.selected : ""} key={generateid(3)} src={el} alt="display" onClick={() => setSelected(el)} />
                )}
            </div>

            <div className={styles.large}>
                <img src={selected} alt="display" />
            </div>
        
        </div>
    )
}

export default Style1