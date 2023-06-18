import styles from './Style1.module.scss';
import React, {useState} from 'react';
import {MdKeyboardArrowRight, MdKeyboardArrowLeft} from 'react-icons/md';

interface Props<T> {
    data: T[],
    show?: number, 
    top?: boolean,
    children: (data: T, index: number, items: T[]) => React.ReactNode
};

interface PropsPages<T>{
    data: T[],
    show?: number, 
    onBack: () => void,
    onPage: (index: number) => () => void,
    onNext: () => void,
    page: number,
    max_pages: number,
}

const Pages = <T,>({data, onBack, max_pages, show=10, page, onPage, onNext}: PropsPages<T>) => (
    max_pages !== 0 && data.length > show ? <div className={styles.pagination}>
        <button onClick={onBack}><MdKeyboardArrowLeft/></button>

        <button onClick={onPage(1)} className={1 === page ? styles.selected : "default"}>{1}</button>    

        {page !== 1 && Array.from(Array(max_pages).keys()).slice(page, page+1).map((index) => 
            <button key={index} onClick={onPage(index)} className={index === page ? styles.selected : "default"}>{index}</button>    
        )}

        {page !== max_pages-1 && Array.from(Array(max_pages).keys()).slice(page, page+1).map((index) => 
            <button key={index} onClick={onPage(index+1)} className={index+1 === page ? styles.selected : "default"}>{index+1}</button>    
        )}

        <button onClick={onPage(max_pages)} className={max_pages === page ? styles.selected : "default"}>{max_pages}</button>    

        <button onClick={onNext}><MdKeyboardArrowRight/></button>
    </div> : null 
)


const Style1 = <T,>({data, show=10, top=false, children}:Props<T>) => {

    const [page, setPage] = useState(1);
    const [items, setItems] = useState(show);

    const max_pages = Math.ceil(data.length / show);

    const onPage = (index: number) => () => {
        setPage(index);
        setItems( index === 1 ? show : (show * index))
    }

    const onBack = () => {
        if(page === 1) return;
        setPage(page => page - 1);
        setItems(items => items-show);
    }

    const onNext = () => {
        if(page === max_pages) return;
        setPage(page => page + 1);
        setItems(items => items+show)
    };

    return (
        <div className={styles.container}>

            {top && <Pages data={data} onBack={onBack} max_pages={max_pages} show={show} page={page} onPage={onPage} onNext={onNext}/>}

            {data.slice(page === 1 ? 0 : items - show, items).map((el, index, items) => 
                children(el, index, items)
            )}

            <Pages data={data} onBack={onBack} max_pages={max_pages} show={show} page={page} onPage={onPage} onNext={onNext} />

        </div>
    )
}

export default Style1