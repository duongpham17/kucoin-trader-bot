import { useState, useEffect } from 'react';
import { useAppDispatch } from './useRedux';

const useFetch = (actions: any, data?: any) => {

    const dispatch = useAppDispatch();

    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setDone(true);
        
        if(done) return;

        if(!data || !data.length) {
            (async () => {
                setLoading(true);
                await dispatch(actions);
                setLoading(false);
            })();
        }

        return () => {setLoading(false)}

    }, [dispatch, actions, data, done]);

    return {
        loading,
        dispatch
    }
};


export default useFetch