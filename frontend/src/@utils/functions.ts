const randomid = (): string => {
    const id = Math.random().toString(36).substring(7);
    return id;
};

export const generateid = (times: number = 2): string => {
    const id = Array.from({length: times}, () => randomid()).join("");
    return id
};

export const shortenword = (word: string, length?: number): string => {
    const s = `${word.substring(0, length ? length : 20)}...`;
    return s;
}

export const firstcaps = (word: string): string => {
    const s = word.split(" ").map((w: string) => w.substring(0, 1).toUpperCase() + w.substring(1)).join(" ");
    return s
};

export const ellipsis = (text: string, end=40) => {
    const s = `${text.substring(0, end).trim()}${text.length >= end ? "..." : ""}`;
    return s;
} 

export const breakword = (word: string, first: number, last: number): string => {
    if(!word) return "";
    const s = `${word.substring(0, first ? first : 20)}...${word.substring(last)}`;
    return s;
};

export const copyToClipboard = (s: string): void => {
    navigator.clipboard.writeText(s)
};

export const reload = (): void => {
    return window.location.reload()
};

export const redirect = (url: string = "/"): void => {
    return window.location.replace(url);
};

export const httpsIpfs = (cid: string): string => {
    return `https://ipfs.io/ipfs/${cid}`;
};

export const cloneObject = <T>(object: T): T => {
    return JSON.parse(JSON.stringify(object));
};

export const isObjectEmpty = (obj: object) => {
    return Object.keys(obj).length === 0;
};

