import styles from './Openarrows.module.scss';

import {MdKeyboardArrowDown} from 'react-icons/md';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  open?: boolean,
  center?: boolean
};

const Button = ({open, center, ...props}:Props) => {
  return (
    <button className={`${styles.container} ${open ? styles.open : styles.close} ${center ? styles.center : ""}`} {...props}>
      <MdKeyboardArrowDown/>
    </button>
  )
}

export default Button

