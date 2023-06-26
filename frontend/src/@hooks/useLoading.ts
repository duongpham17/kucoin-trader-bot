import {useState, useEffect} from 'react';

const useLoading = () => {

    const [loading, setLoading] = useState(false);

    const onLoading = async (callback: CallableFunction) => {
        if(loading) return;
        setLoading(true);
        await callback();
        setLoading(false);
    }

    useEffect(() => {
        return () => setLoading(false);
    }, [])

    return {
        loading,
        setLoading,
        onLoading
    }
}

export default useLoading