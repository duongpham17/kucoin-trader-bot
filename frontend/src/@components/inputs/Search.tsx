import styles from './Search.module.scss';
import React,{useState, useEffect} from 'react';

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    color?: "dark",
    label1?: string | number, 
    label2?: string | number | React.ReactNode,
    error?: boolean,
    borderBottom?: boolean,

    data: any,
    value: string,
    onSelectValue: (a: any) => void 
};

const Search = ({color, label1, label2, error, borderBottom, data, value, onSelectValue, ...props}:Props) => {

    const [isSelected, setIsSelected] = useState(false);

    const results: string[] = value && data.filter((el: string) => el.toLowerCase().includes(value.toLowerCase()));

    const onSelect = (value: string) => {
        onSelectValue(value);
        setIsSelected(true);
    };

    useEffect(() => {
        if(data.includes(value)) return;
        setIsSelected(false);
    }, [value, data]);
    
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
                    {error ? <small className={styles.error}>{label2}</small> : <small>{label2}</small>}
                </label>
            }

            <input 
                {...props} 
                className={`${styles[color ? color : "plain"]} ${borderBottom ? styles.borderBottom : styles.border}` } 
                value={value.toLowerCase()}
            />

            {
                !!results.length && !isSelected && <div className={styles.search}>
                    {results.map((el: string) => 
                        <button className={styles.element} key={el} onClick={() => onSelect(el)}>
                            <span>{el}</span>
                            <span>&#8592;</span>
                        </button>    
                    )}
                </div>
            }

        </div>
  )
}

export default Search