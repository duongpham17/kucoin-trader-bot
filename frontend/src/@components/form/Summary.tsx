import styles from './Summary.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: any,
  selected: boolean,
  value?: any,
  children: React.ReactNode,
}

const Summary = ({selected, name, value, children, ...props}:Props) => {
  return (
    <div className={styles.container}>

    { !selected &&
      <button className={styles.button} {...props}>
        <p>{name}</p>
       {value && <p>{value}</p>}
      </button>
    }

    { selected &&
    <div className={styles.content}>
      <p className={styles.name}>{name}</p>
      {children}
    </div>
    }

    </div>
  )
}

export default Summary