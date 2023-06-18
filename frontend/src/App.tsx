import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@redux/store';

import Themes from 'themes';
import Global from '@global';
import Navbar from 'layout/navbar';
import Pages from 'pages';

export const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Themes>
        <Global/>
        <Navbar/>
        <Pages/>
      </Themes>
    </BrowserRouter>
  </Provider>
);

export default App;
