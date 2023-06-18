import styles from './index.module.scss';
import React from 'react';

import Chart from './chart';
import Summary from './summary';
import Create from './create';
import Orders from './orders';

const Trade = () => {
  return (
    <div className={styles.container}>
      <div className={styles.information}>
        <Summary/>
        <Chart />
        <Orders />
      </div>
      <div className={styles.create}>
        <Create />
      </div>
    </div>
  )
}

export default Trade