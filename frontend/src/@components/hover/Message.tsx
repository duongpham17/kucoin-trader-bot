import styles from './Message.module.scss';
import React from 'react';

interface Props {
  children: React.ReactNode,
  message: string
}

const Message = ({children, message}: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.children}>{children}</div>
      <div className={styles.message}>{message}</div>
    </div>
  )
}

export default Message