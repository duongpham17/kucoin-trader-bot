import styles from './Pages.module.scss'
import {Routes, Route} from 'react-router-dom';

import Home from 'pages/home';
import Order from 'pages/order';
import Trade from 'pages/trade';
import Unknown from 'pages/unknown';

const Pages = () => {
  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/orders" element={<Order/>} />
        <Route path="/trade" element={<Trade/>} />
        <Route path="*" element={<Unknown/>} />
      </Routes>
    </div>
  )
}

export default Pages