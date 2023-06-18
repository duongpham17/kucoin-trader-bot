import styles from './ProfitNLoss.module.scss';

interface Props {
  value: number | string,
  profit: number | string,
  loss: number | string,
}

const ProfitNLoss = ({value, profit, loss}: Props) => {
  return (
    <div className={styles.container}>
        <div className={styles.info}>
            <p>Profit</p>
            <p>Loss</p>
        </div>
        <progress max="100" value={value} />
        <div className={styles.info}>
            <p>{profit}</p>
            <p>{loss}</p>
        </div>
    </div>
  )
}

export default ProfitNLoss