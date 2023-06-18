import styles from './Form.module.scss';
import React, { ReactElement, ReactNode } from 'react';

interface Props extends React.HTMLProps<HTMLFormElement> {
  children: ReactElement | ReactNode,
  onSubmit: React.FormEventHandler,
  edited?: boolean,
  loading?: boolean,
  width?: number
  button?: boolean,
  buttonClr?: "main" | "light" | "dark" | "none",
  marginBottom?: string
}

const Form = ({onSubmit, children, loading, edited = true, button=true, width, buttonClr, marginBottom, ...props}: Props) => {
  return (
    <form className={styles.container} onSubmit={onSubmit} style={{"width": `${width}px`, "marginBottom": marginBottom || ""}}  {...props} >

      {children}

      {loading && <section className={styles.loading}/> }
      
      {button && !loading && edited && <button className={`${styles.button} ${styles[buttonClr || "none"]}`}> &#x2192; </button> }

    </form>
  )
}

export default Form