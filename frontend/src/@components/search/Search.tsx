import styles from './Search.module.scss';
import React, {useState, ReactNode, useEffect} from 'react';
import {AiOutlineSearch} from 'react-icons/ai';
import {MdClose} from 'react-icons/md';

interface Props<T>{
  initialData: T[],
  dataKey: string,
  placeholder?: string, 
  children: (results: T[]) => ReactNode,
};

export const Search = <T,>({initialData, children, dataKey, placeholder}: Props<T>) => {

  const [value, setValue] = useState("");

  const [results, setResults] = useState<T[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {value} = e.target;
    setValue(value);
    const data = initialData as T[];
    setResults(data.filter((el: any) => el[dataKey].toLowerCase().includes(value)));
  };

  const onClose = () => {
    setValue("");
    setResults(initialData);
  };

  useEffect(() => {
    const data = initialData as T[];
    setResults(data.filter((el: any) => el[dataKey].toLowerCase().includes(value)));
  }, [initialData, dataKey, value]);

  return (
    <div className={styles.container}>

      <div className={styles.searchbar}>
        <AiOutlineSearch className={styles.searchIcon} />
        <input placeholder={placeholder || "Search"} name="value" value={value} onChange={onChange} />
        {value && <MdClose className={styles.closeIcon} onClick={onClose} />}
      </div>

      { children(results) }
    </div>
  )
}

export default Search