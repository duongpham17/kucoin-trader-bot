import Create from './create';
import Chart from './chart';
import Summary from './summary';
import Orders from './orders';
import Analytics from './analytics';

const Trade = () => {
  return (
    <>
      <Create />
      <Summary/>
      <Chart />
      <Analytics />
      <Orders />
    </>
  )
}

export default Trade