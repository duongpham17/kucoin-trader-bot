import {useState} from 'react';

interface Props<T> {
    initialState?: T,
    local?: string,
}

const useOpen = <T>({initialState, local}: Props<T>) => {

    const [open, setOpen] = useState(false);

    const [openValue, setOpenValue] = useState<T | null>(initialState || null);

    const [openItems, setOpenItems] = useState<any[]>([initialState]);

    const local_value = local ? localStorage.getItem(local) : "";
    
    const local_value_parsaed = local_value ? JSON.parse(local_value) : "";

    const [openLocal, setOpenLocal] = useState<any>(local_value_parsaed);

    const onOpen = () => setOpen(!open);

    const onOpenValue = (value:T, change=false) => {
        if((value === openValue) && !change) return setOpenValue(null);
        setOpenValue(value);
    };

    const onOpenItems = (value: string) => {
        const isOpen = openItems.includes(value);
        if(isOpen) {
            const newOpen = openItems.filter(el => el !== value);
            setOpenItems(newOpen);
        } else {
            setOpenItems((state) => [...state, value])
        }
    };

    const onOpenItemsClear = () => {
        setOpenItems([]);
    };

    const onOpenLocal = (value: string, clear=true) => {
        if(!local) return;
        const local_value = local ? localStorage.getItem(local) : "";
        const local_value_parsaed = local_value ? JSON.parse(local_value) : "";

        if(value === local_value_parsaed && clear) {
            localStorage.setItem(local, "");
            setOpenLocal("");
        } else {
            localStorage.setItem(local, JSON.stringify(value));
            setOpenLocal(value);
        }
    };

    const onLocalClear = (name: any) => {
        localStorage.removeItem(name);
        setOpenLocal("");
    };

    return {
        setOpen,
        onOpen,
        open,
        openValue,
        onOpenValue,
        setOpenValue,
        openItems,
        setOpenItems,
        onOpenItems,
        onOpenItemsClear,
        openLocal,
        onOpenLocal,
        onLocalClear
    }
};

export default useOpen;