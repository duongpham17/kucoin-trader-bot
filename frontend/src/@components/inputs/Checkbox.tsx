import styles from './Checkbox.module.scss';

interface Props {
  label: string,
  selected: boolean | undefined | null,
  value: any,
  margin?: boolean,
  onClick: () => void,
};

const Checkbox = ({label, onClick, selected, value, margin}:Props) => {
    
  return (
    <div className={styles.container}>
      <label>{label}</label>
      <button type="button" className={`${margin ? styles.margin : ""}`} onClick={onClick}>
        <span>{value}</span>
        <span className={`${styles.box} ${selected ? styles.selected : ""}`} />
      </button>
    </div>
  )
}

export default Checkbox