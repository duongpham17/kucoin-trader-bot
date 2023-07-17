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

export const date = (iso: string | Date, length=0): string => {
    return iso.toLocaleString().split("T").join(" ").slice(length, 19);
};

export const timerLess24 = (future_time: number) => {
    return new Date(future_time - Date.now()).toISOString().slice(11,19);
};

export const timeExpired = (future: Date) => {
    const isExpired = Date.now() >= new Date(future).getTime() + (60 * 60 * 1000) 
    return isExpired
};

export const timeDifference = (future: Date, past: Date): string => {
    const duration = new Date(future).getTime() - new Date(past).getTime();
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    const hours1 = (hours < 10) ? "0" + hours : hours;
    const minutes1 = (minutes < 10) ? "0" + minutes : minutes;
    const seconds1 = (seconds < 10) ? "0" + seconds : seconds;
    return hours1 + ":" + minutes1 + ":" + seconds1
};

export const second_till_zero = (minute: number) => {
    const current_hours_in_milliseconds : number = Number(Date.now().toString().slice(-10));
    const mod = current_hours_in_milliseconds % (60000 * minute);
    const convert_to_seconds = mod / 1000;
    const second_to_zero = (minute * 60) - Math.trunc(convert_to_seconds);
    return second_to_zero
};

export const timeExpire = (future: Date, milli=0) => {
    const time = (new Date(future).getTime()+(milli*60*1000)) - Date.now();
    const minutes = Math.round(time / 60 / 1000);
    return minutes
};

export const minutes_to_string = (minutes: number) => {
    const time = 60 > minutes ? `${minutes} minute` :
        minutes >= 60 && minutes < (60 * 24) ? `${minutes / 60} hour` :
        minutes >= (60 * 24) && minutes < (60 * 24 * 7) ? `${minutes / 60 / 24} day` :
        `${minutes / 60 / 24 / 7} week`
    return time;
}