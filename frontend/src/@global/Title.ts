import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

const Title = () => {
    const location = useLocation();

    const name = "Trader";

    useEffect(() => {
        const title = location.pathname.slice(1).replace(/\//g, "-").split("-").splice(0, 2);
        const capitalise = (array: string[]) => array.map(word => word.substring(0, 1).toUpperCase() + word.substring(1)).join(" ").replace(/-/g, "");
        document.title = `${name} | ${title[0].length >= 2 ? `${capitalise(title)}` : "Home"}`;
    }, [location]);

    return null
}

export default Title;