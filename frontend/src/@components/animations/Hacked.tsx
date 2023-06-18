import { useEffect, useState } from 'react';

interface Props {
    text: string | number,
    speed?: number,
    lowercase?: boolean
}

const Hacked = ({text, speed, lowercase}: Props) => {

    const [iterations, setIterations] = useState(0);
    const [hackedText, setHackedrTitle] = useState("");

    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const letters = lowercase ? alpha.toLowerCase() : alpha;

    const text_to_string = text.toString();

    useEffect(() => {

        if(iterations >= text_to_string.length) return;

        const interval = setInterval(() => {

        const title = text_to_string.split("").map((letter, index) => {
            if (index <= iterations) return text_to_string[index];
            return letters[Math.floor(Math.random() * 26)];
        }).join("");

        setHackedrTitle(title);

        setIterations(i => i+(1/2));

        }, speed || 30);

        return () => clearInterval(interval);

    }, [hackedText, iterations, text, letters, speed, text_to_string]);

    return (
        <>{hackedText}</>
    )
}

export default Hacked