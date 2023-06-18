import './Themes.scss';
import {createContext, ReactNode, useLayoutEffect, useState} from 'react';
import {localSet, localGet} from '@utils/localstorage';
import {ThemeTypes} from './Data';

export interface PropsTypes {
    theme: ThemeTypes,
    onSetTheme: () => void,
};

// for consuming in children components, initial state
export const Context = createContext<PropsTypes>({
    theme: {
        name: "light",
        background: "white",
    },
    onSetTheme: () => null
});

// Provider in your app
export const Theme = ({children}: {children: ReactNode}) => {

    const theme_default = {name: "light", background: "white"};

    const theme_saved: ThemeTypes = localGet("theme");

    const theme_selected = theme_saved || theme_default;

    const [theme, setTheme] = useState<ThemeTypes>(theme_selected)

    useLayoutEffect(() => { 
        document.body.style.background = theme.background 
    }, [theme]);

    const onSetTheme = () => {
        let theme_change = {name: "light", background: "white"};
        if(theme.name === "light") theme_change = {name: "night", background: "black"};
        if(theme.name === "night") theme_change = {name: "light", background: "white"};
        setTheme(theme_change);
        localSet("theme", theme_change);
    };

    const value: PropsTypes = {
        theme,
        onSetTheme,
    };
  
    return (
        <Context.Provider value={value}>
            <div className={`theme-${theme.name}`}>
                {children}
            </div>
        </Context.Provider>
    )
};

export default Theme