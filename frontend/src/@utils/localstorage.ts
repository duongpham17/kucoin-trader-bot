export const localSet = (name: string, data: {} | []): void => {
    localStorage.setItem(name, JSON.stringify(data));
} 

export const localGet = (name: string): any => {
    const string = localStorage.getItem(name);
    if(string) {
        const isParse = string.includes("{") || string.includes("[");
        if(isParse) {
            const data = JSON.parse(string);
            return data;
        };
        if(!isParse){
            return string
        };
    }
    return null;
}