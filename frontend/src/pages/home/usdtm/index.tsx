import styles from './Usdtm.module.scss';
import React, {useState} from 'react';
import coins from '@data/kucoin-futures-usdtm';
import { Link } from 'react-router-dom';

const Usdtm = () => {

    const [search, setSearch] = useState("");

    const [results, setResults] = useState(coins);

    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setResults(coins.filter(v => v.toLowerCase().includes(value.toLowerCase())));
        setSearch(value);
    }   

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>Crypto</h1>
                <label>Results: {results.length}</label>
            </div>
            <div className={styles.search}>
                <input value={search} onChange={onSearch} placeholder={"Search usdt pairs"} />
            </div>
            <div className={styles.coins}>
                {results.map(coin => 
                    <Link key={coin} to={`/trade?symbol=${coin}`}>{coin}</Link>  
                )}
            </div>
        </div>
    )
}

export default Usdtm