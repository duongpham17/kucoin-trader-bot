import React from 'react';
import styles from './Label.module.scss';

interface Props {
  label1: string | React.ReactNode | React.ReactElement,
  label2?: string | React.ReactNode | React.ReactElement,
  error?: boolean,
}

const Labels = ({label1, label2, error}: Props) => {
  return (
    <div className={styles.container}>
      <label>{label1}</label>
      {error ? <small className={styles.error}>{label2}</small> : <small>{label2}</small>}
    </div>
  )
}

export default Labels