import styles from './Observer.module.scss';
import React, {useEffect, useRef} from 'react';

interface Props {
    children: React.ReactNode,
    threshold?: number
}

const Observer = ({children, threshold=0.5}: Props) => {

    const ref = useRef<any>();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            const [entry] = entries;
            entry.target.classList.toggle(styles.show, entry.isIntersecting);  
            if(entry.isIntersecting) observer.unobserve(entry.target);
        }, {
            threshold: threshold
        });
        observer.observe(ref.current);
    }, [threshold]);

    return (
        <div className={styles.container} ref={ref}>
            {children}
        </div>
    )
}

export default Observer