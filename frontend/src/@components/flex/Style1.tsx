import styles from './Style1.module.scss';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode,
};

const Style1 = ({children, ...props}: Props) => {
  return (
    <div className={styles.container} {...props}>
      {children}
    </div>
  )
};

export default Style1