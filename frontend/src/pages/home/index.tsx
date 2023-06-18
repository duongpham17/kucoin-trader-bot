import styles from './Home.module.scss';

import Trades from './trades';
import Usdtm from './usdtm';

const Home = () => {


  return (
    <div className={styles.container}>

      <Trades/>

      <Usdtm/>

    </div>
  )
}

export default Home