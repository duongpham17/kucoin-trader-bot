import styles from './Spinner.module.scss';

interface Props {
  size?: number,
  thickness?: number,
  color?: string,
  center?: boolean 
}

const Spinner = ({color="", center=false, size=20, thickness=2}:Props) => {
  return (
    <span 
      style={{width: `${size}px`, height: `${size}px`, border: `${thickness}px solid`, borderColor: color || "", borderTopColor: "transparent"}}      
      className={`${styles.loading} ${center ? styles.center : "default"}`}  
    />  
  )
}

export default Spinner