import styles from './Navbar.module.scss';
import React, { useContext } from 'react';
import { Context } from 'themes'; 
import { BsSunFill, BsFillMoonFill } from 'react-icons/bs';
import { AiFillHome, AiFillFileText } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Message from '@components/hover/Message';

const Navbar = () => {

  const {onSetTheme, theme} = useContext(Context);

  return (
    <div className={styles.container}>

      <nav>
        <Message message='Home'><Link to="/"><AiFillHome/></Link></Message>
        <Message message='History'><Link to="/orders"><AiFillFileText/></Link></Message>
      </nav>

      <nav>
        {theme.name === "light" && 
          <Message message='Light'><button onClick={onSetTheme}><BsSunFill/></button> </Message>
        }
        {theme.name === "night" &&
          <Message message='Dark'><button onClick={onSetTheme}><BsFillMoonFill/></button> </Message>
        }
      </nav>

    </div>
  )
}

export default Navbar