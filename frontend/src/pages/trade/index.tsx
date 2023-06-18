import styles from './index.module.scss';
import React from 'react';

import Create from './create';
import Chart from './chart';
import Summary from './summary';
import Orders from './orders';

const Trade = () => {
  return (
    <div className={styles.container}>
      <Create />
      <Summary/>
      <Chart />
      <Orders />
    </div>
  )
}

export default Trade