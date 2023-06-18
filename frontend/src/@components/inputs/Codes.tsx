import styles from './Codes.module.scss';
import React, { useRef, useState } from "react";

interface Props {
  amount: number,
  callback: (v: string) => any
}

const InputCode = ({ amount, callback }: Props) => {

  const [code, setCode] = useState<string[]>([...Array(amount)].map(() => ""))

  const inputs = useRef<any>([]);

  const processInput = (e: React.ChangeEvent<HTMLInputElement>, slot: any) => {
    const num = e.target.value;
    if (/[^0-9]/.test(num)) return;
    const newCode = [...code];
    newCode[slot] = num;
    setCode(newCode);
    callback(newCode.join(""));
    if (slot !== code.length - 1) {
      inputs.current[slot + 1].focus();
    }
  };

  const onKeyUp = (e: React.KeyboardEvent, slot: any) => {
    if (e.keyCode === 8 && !code[slot] && slot !== 0) {
      const newCode = [...code];
      newCode[slot - 1] = "";
      setCode(newCode);
      callback(newCode.join(""));
      inputs.current[slot - 1].focus();
    }
  };

  return (
    <div className={styles.container}>
      <div>
        {code.map((num: string, idx: number) => {
          return (
            <input
              className={styles.box}
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={num}
              autoFocus={!code[0].length && idx === 0}
              onChange={e => processInput(e, idx)}
              onKeyUp={e => onKeyUp(e, idx)}
              ref={ref => inputs.current.push(ref)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default InputCode;