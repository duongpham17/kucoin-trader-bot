import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Trades from '@redux/actions/trades';
import { ITrades } from '@redux/types/trades';
import useForm from '@hooks/useForm';
import validation from './validation';
import useQuery from '@hooks/useQuery';
import { strategies, description } from '@data/strategies';

import Checkbox from '@components/inputs/Checkbox';
import Input from '@components/inputs/Input';
import Select from '@components/inputs/Select';
import Button from '@components/buttons/Button';
import Flex from '@components/flex/Style1';
import Container from '@components/containers/Style1';
import Slidein from '@components/slidein/Style1';

const Create = () => {

    const [dispatch, query] = [useAppDispatch(), useQuery()];

    const {latest_price} = useAppSelector(state => state.trades)

    const initialState: Partial<ITrades> = {
        live: false,
        market_id: query.getQueryValue("symbol") || "",
        strategy: "",
        leverage: 0,
        position_size: 0,
        range_short: 0,
        range_long: 0,
        range_stop_loss: 0,
        range_take_profit: 0,
        range_over_bought_rsi: 70,
        range_over_sold_rsi: 30,
        range_period_rsi: 10,
        createdAt: new Date(),
    };

    const { onSubmit, onChange, onSetValue, values, errors, loading, onClear } = useForm(initialState, callback, validation);

    async function callback(){
        await dispatch(Trades.create(values));
        onClear();
    };

    return (
        <Flex>
            <div></div>
            <Slidein icon={<Button label1="Create Bot" color="main"/>} width={400}>

            <form onSubmit={onSubmit}>

                <Input 
                    label1="Market Id"
                    value={values.market_id}
                    onChange={() => {}}
                />
                
                <Checkbox 
                    label="Environment" 
                    value={values.live ? "Live" : "Test"} 
                    selected={values.live}
                    onClick={() => onSetValue({live: !values.live})} 
                />

                <Select 
                    label1="Strategy"
                    error={errors.strategy}
                    items={strategies.map(el => el.name)}
                    selected={!values.strategy ? "Select" : `${values.strategy} : ${description(values.strategy)}` }
                    onClick={e => onSetValue({strategy: e})}
                />

                {values.strategy!.includes("rsi") && 
                    <>
                        <Input 
                            label1="Range OB RSI"
                            label2={errors.range_over_bought_rsi}
                            error={errors.range_over_bought_rsi}
                            placeholder='default rsi will be 70'
                            type="number"
                            name="range_over_bought_rsi"
                            value={values.range_over_bought_rsi}
                            onChange={onChange}
                        />
                        <Input 
                            label1="Range OS RSI"
                            label2={errors.range_over_sold_rsi}
                            error={errors.range_over_sold_rsi}
                            placeholder='default rsi will be 30'
                            type="number"
                            name="range_over_sold_rsi"
                            value={values.range_over_sold_rsi}
                            onChange={onChange}
                        />
                        <Input 
                            label1="RSI Period"
                            label2={errors.range_period_rsi}
                            error={errors.range_period_rsi}
                            placeholder='default period 10'
                            type="number"
                            name="range_period_rsi"
                            value={values.range_period_rsi}
                            onChange={onChange}
                        />
                    </>
                }

                {!values.strategy!.includes("rsi") && 
                    <Flex>
                        <Input 
                            label1="Range Long"
                            error={errors.range_long}
                            placeholder='Entry long range'
                            type="number"
                            name="range_long"
                            value={values.range_long || ""}
                            onChange={onChange}
                        />
                        <Input 
                            label1="Range Short"
                            error={errors.range_short}
                            placeholder='Entry short range'
                            type="number"
                            name="range_short"
                            value={values.range_short || ""}
                            onChange={onChange}
                        />
                    </Flex>
                }

                <Flex>
                    <Input 
                        label1="Range Stop Loss"
                        error={errors.range_stop_loss}
                        placeholder='Exit position range'
                        type="number"
                        name="range_stop_loss"
                        value={values.range_stop_loss || ""}
                        onChange={onChange}
                    />
                    <Input 
                        label1="Range Take Profit"
                        error={errors.range_take_profit}
                        placeholder='Exit position range'
                        type="number"
                        name="range_take_profit"
                        value={values.range_take_profit || ""}
                        onChange={onChange}
                    />
                </Flex>

                <Flex>
                    <Input 
                        label1="Leverage"
                        label2={errors.leverage}
                        error={errors.leverage}
                        placeholder='1 - 30'
                        type="number"
                        name="leverage"
                        value={values.leverage || ""}
                        onChange={onChange}
                    />
                    <Input 
                        label1="Position Size"
                        error={errors.position_size}
                        placeholder='size of position'
                        type="number"
                        name="position_size"
                        value={values.position_size || ""}
                        onChange={onChange}
                    />
                </Flex>

                <Container background='dark'>
                    <p>Estimated cost</p>
                    <p>$ {(((values.position_size || 0) * (latest_price)) / (values.leverage || 0)).toFixed(2)}</p>
                </Container>

                <Button 
                    label1="Create" 
                    type="submit" 
                    color='blue' 
                    loading={loading}
                />

            </form>

            </Slidein>
        </Flex>
    )
}

export default Create