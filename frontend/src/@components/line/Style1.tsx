import styles from './Style1.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    color?: "light" | "dark" | "grey" | "white" | "lighty" | "black"
}

const Line1 = ({color, ...props}: Props ) => (
    <div className={`${styles.container} ${styles[color || "light"]}`} {...props}/>
)

export default Line1