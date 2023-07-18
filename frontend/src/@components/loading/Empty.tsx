import styles from './Empty.module.scss';
import React from 'react'
import {LuFileCode} from 'react-icons/lu';

const Empty = () => {
  return (
    <div className={styles.container}>
        <p>Nothing found</p>
        <LuFileCode/>
    </div>
  )
}

export default Empty