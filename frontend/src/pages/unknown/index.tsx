import styles from './Unknown.module.scss';
import {Link} from 'react-router-dom';
import Hacked from '@components/animations/Hacked';

const Unknown = () => {
  return (
    <div className={styles.container}>
      <Link to="/">
        <Hacked text="404 | Page not found" />
      </Link>
    </div>
  )
}

export default Unknown