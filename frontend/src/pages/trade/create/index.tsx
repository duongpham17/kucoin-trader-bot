import { strategies, description } from '@data/strategies';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Trades from '@redux/actions/trades';
import { ITrades } from '@redux/types/trades';
import useQuery from '@hooks/useQuery';
import useForm from '@hooks/useForm';
import validation from './validation';

import { minuteToString } from '@utils/time';

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
        range_target_high: 0,
        range_target_low: 0,
        range_period: 5,
        range_time: 0,
        range_cooldown_minute: 0,
        createdAt: new Date(),
    };

    const { onSubmit, onChange, onSetValue, values, errors, loading, onClear } = useForm(initialState, callback, validation);

    async function callback(){
        await dispatch(Trades.create({...values}));
        onClear();
    };

    const setPeriod = (value: string) => {
        const period = 
            value.toString().includes("hour") ? Number(value.toString().split(" ")[0]) * 60 :
            value.toString().includes("day") ? Number(value.toString().split(" ")[0]) * 60 * 24 :
            value.toString().includes("week") ? Number(value.toString().split(" ")[0]) * 60 * 24 * 7 :
            value.toString().includes("month") ? Number(value.toString().split(" ")[0]) * 60 * 24 * 7 * 28 :
            Number(value.toString().split(" ")[0]);
        onSetValue({range_period: period});
    };

    return (
        <Flex>
            <div></div>
            <Slidein icon={<Button label1="Create Bot" color="main"/>} width={400}>

            <form onSubmit={onSubmit}>

                <Button 
                    label1="Create" 
                    type="submit" 
                    color='blue' 
                    loading={loading}
                    margin
                />

                <Flex>
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
                </Flex>

                <Select 
                    label1="Strategy"
                    error={errors.strategy}
                    items={strategies.map(el => el.name)}
                    selected={!values.strategy ? "Select" : `${values.strategy} : ${description(values.strategy)}` }
                    onClick={e => onSetValue({strategy: e})}
                />

                <Flex>
                    <Input 
                        label1="Expire Timer"
                        placeholder='minutes'
                        type="number"
                        name="range_time"
                        value={values.range_time || ""}
                        onChange={onChange}
                    />

                    <Input 
                        label1="Cooldown Timer"
                        placeholder='minutes'
                        type="number"
                        name="range_cooldown_minute"
                        value={values.range_cooldown_minute || ""}
                        onChange={onChange}
                    />
                </Flex>

                {/*********** COUNTER ***********/}
                {values.strategy === "counter" &&
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
                {values.strategy === "counter long only" &&
                    <Input 
                        label1="Range Long"
                        error={errors.range_long}
                        placeholder='Entry long range'
                        type="number"
                        name="range_long"
                        value={values.range_long || ""}
                        onChange={onChange}
                    />
                }
                {values.strategy === "counter short only" &&
                    <Input 
                        label1="Range Short"
                        error={errors.range_short}
                        placeholder='Entry short range'
                        type="number"
                        name="range_short"
                        value={values.range_short || ""}
                        onChange={onChange}
                    />
                }       

               {/*********** TREND ***********/}
                {values.strategy === "trend" &&
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
                {values.strategy === "trend long only" &&
                    <Input 
                        label1="Range Long"
                        error={errors.range_long}
                        placeholder='Entry long range'
                        type="number"
                        name="range_long"
                        value={values.range_long || ""}
                        onChange={onChange}
                    />
                }
                {values.strategy === "trend short only" &&
                    <Input 
                        label1="Range Short"
                        error={errors.range_short}
                        placeholder='Entry short range'
                        type="number"
                        name="range_short"
                        value={values.range_short || ""}
                        onChange={onChange}
                    />
                }       
                
                {/*********** RSI TREND ***********/}
                {values.strategy === "rsi trend long only" && 
                    <>
                        <Flex>
                            <Input 
                                label1="Over Bought RSI"
                                label2={errors.range_over_bought_rsi}
                                error={errors.range_over_bought_rsi}
                                placeholder='default rsi will be 70'
                                type="number"
                                name="range_over_bought_rsi"
                                value={values.range_over_bought_rsi}
                                onChange={onChange}
                            />
                            <Input 
                                label1="Over Sold RSI"
                                label2={errors.range_over_sold_rsi}
                                error={errors.range_over_sold_rsi}
                                placeholder='default rsi will be 30'
                                type="number"
                                name="range_over_sold_rsi"
                                value={values.range_over_sold_rsi}
                                onChange={onChange}
                            />
                        </Flex>
                        <Select 
                            label1="Period"
                            items={["1 min", "5 min", "15 min", "30 min", "1 hour", "2 hour", "4 hour", "12 hour", "1 day", "1 week"]} 
                            selected={minuteToString(Number(values.range_period))} 
                            onClick={setPeriod} 
                        /> 
                    </>
                }
                {values.strategy === "rsi trend short only" && 
                    <>
                        <Flex>
                            <Input 
                                label1="Over Bought RSI"
                                label2={errors.range_over_bought_rsi}
                                error={errors.range_over_bought_rsi}
                                placeholder='default rsi will be 70'
                                type="number"
                                name="range_over_bought_rsi"
                                value={values.range_over_bought_rsi}
                                onChange={onChange}
                            />
                            <Input 
                                label1="Over Sold RSI"
                                label2={errors.range_over_sold_rsi}
                                error={errors.range_over_sold_rsi}
                                placeholder='default rsi will be 30'
                                type="number"
                                name="range_over_sold_rsi"
                                value={values.range_over_sold_rsi}
                                onChange={onChange}
                            />
                        </Flex>
                        <Select 
                            label1="Period"
                            items={["1 min", "5 min", "15 min", "30 min", "1 hour", "2 hour", "4 hour", "12 hour", "1 day", "1 week"]} 
                            selected={minuteToString(Number(values.range_period))} 
                            onClick={setPeriod} 
                        /> 
                    </>
                }

                {/*********** RSI COUNTER ***********/}
                {values.strategy === "rsi counter" && 
                    <>
                        <Flex>
                            <Input 
                                label1="Over Bought RSI"
                                label2={errors.range_over_bought_rsi}
                                error={errors.range_over_bought_rsi}
                                placeholder='default rsi will be 70'
                                type="number"
                                name="range_over_bought_rsi"
                                value={values.range_over_bought_rsi}
                                onChange={onChange}
                            />
                            <Input 
                                label1="Over Sold RSI"
                                label2={errors.range_over_sold_rsi}
                                error={errors.range_over_sold_rsi}
                                placeholder='default rsi will be 30'
                                type="number"
                                name="range_over_sold_rsi"
                                value={values.range_over_sold_rsi}
                                onChange={onChange}
                            />
                        </Flex>
                        <Select 
                            label1="Period"
                            items={["1 min", "5 min", "15 min", "30 min", "1 hour", "2 hour", "4 hour", "12 hour", "1 day", "1 week"]} 
                            selected={minuteToString(Number(values.range_period))} 
                            onClick={setPeriod} 
                        /> 
                    </>
                }
                {values.strategy === "rsi counter long only" && 
                    <>
                        <Flex>
                            <Input 
                                label1="Over Bought RSI"
                                label2={errors.range_over_bought_rsi}
                                error={errors.range_over_bought_rsi}
                                placeholder='default rsi will be 70'
                                type="number"
                                name="range_over_bought_rsi"
                                value={values.range_over_bought_rsi}
                                onChange={onChange}
                            />
                            <Input 
                                label1="Over Sold RSI"
                                label2={errors.range_over_sold_rsi}
                                error={errors.range_over_sold_rsi}
                                placeholder='default rsi will be 30'
                                type="number"
                                name="range_over_sold_rsi"
                                value={values.range_over_sold_rsi}
                                onChange={onChange}
                            />
                        </Flex>
                        <Select 
                            label1="Period"
                            items={["1 min", "5 min", "15 min", "30 min", "1 hour", "2 hour", "4 hour", "12 hour", "1 day", "1 week"]} 
                            selected={minuteToString(Number(values.range_period))} 
                            onClick={setPeriod} 
                        /> 
                    </>
                }
                {values.strategy === "rsi counter short only" && 
                    <>
                        <Flex>
                            <Input 
                                label1="Over Bought RSI"
                                label2={errors.range_over_bought_rsi}
                                error={errors.range_over_bought_rsi}
                                placeholder='default rsi will be 70'
                                type="number"
                                name="range_over_bought_rsi"
                                value={values.range_over_bought_rsi}
                                onChange={onChange}
                            />
                            <Input 
                                label1="Over Sold RSI"
                                label2={errors.range_over_sold_rsi}
                                error={errors.range_over_sold_rsi}
                                placeholder='default rsi will be 30'
                                type="number"
                                name="range_over_sold_rsi"
                                value={values.range_over_sold_rsi}
                                onChange={onChange}
                            />
                        </Flex>
                        <Select 
                            label1="Period"
                            items={["1 min", "5 min", "15 min", "30 min", "1 hour", "2 hour", "4 hour", "12 hour", "1 day", "1 week"]} 
                            selected={minuteToString(Number(values.range_period))} 
                            onClick={setPeriod} 
                        /> 
                    </>
                }
                
                {/*********** STRENGTH ***********/}
                {(values.strategy === "strength counter" || values.strategy === "strength trend") && 
                    <>
                        <Flex>
                            <Input 
                                label1="High strength"
                                label2={errors.range_target_high}
                                error={errors.range_target_high}
                                type="number"
                                name="range_target_high"
                                value={values.range_target_high || ""}
                                onChange={onChange}
                            />
                            <Input 
                                label1="Low strength"
                                label2={errors.range_target_low}
                                error={errors.range_target_low}
                                type="number"
                                name="range_target_low"
                                value={values.range_target_low || ""}
                                onChange={onChange}
                            />
                        </Flex>
                        <Select 
                            label1="Period"
                            items={["1 min", "5 min", "15 min", "30 min", "1 hour", "2 hour", "4 hour", "12 hour", "1 day", "1 week"]} 
                            selected={minuteToString(Number(values.range_period))} 
                            onClick={setPeriod} 
                        /> 
                    </>
                }

                {/*********** VELOCITY ***********/}
                {(values.strategy === "velocity counter" || values.strategy === "velocity trend") && 
                    <>
                        <Flex>
                            <Input 
                                label1="Pump Range"
                                label2={errors.range_target_high}
                                error={errors.range_target_high}
                                type="number"
                                name="range_target_high"
                                value={values.range_target_high || ""}
                                onChange={onChange}
                            />
                            <Input 
                                label1="Dump Range"
                                label2={errors.range_target_low}
                                error={errors.range_target_low}
                                type="number"
                                name="range_target_low"
                                value={values.range_target_low || ""}
                                onChange={onChange}
                            />
                        </Flex>
                        <Select 
                            label1="Period"
                            items={["1 min", "5 min", "15 min", "30 min", "1 hour", "2 hour", "4 hour", "12 hour", "1 day", "1 week"]} 
                            selected={minuteToString(Number(values.range_period))} 
                            onClick={setPeriod} 
                        /> 
                    </>
                }

                {/*********** TREND ***********/}
                {(values.strategy === "trend counter" || values.strategy === "trend trend") && 
                    <>
                        <Flex>
                            <Input 
                                label1="Up Range"
                                label2={errors.range_target_high}
                                error={errors.range_target_high}
                                type="number"
                                name="range_target_high"
                                value={values.range_target_high || ""}
                                onChange={onChange}
                            />
                            <Input 
                                label1="Down Range"
                                label2={errors.range_target_low}
                                error={errors.range_target_low}
                                type="number"
                                name="range_target_low"
                                value={values.range_target_low || ""}
                                onChange={onChange}
                            />
                        </Flex>
                        <Select 
                            label1="Period"
                            items={["1 min", "5 min", "15 min", "30 min", "1 hour", "2 hour", "4 hour", "12 hour", "1 day", "1 week"]} 
                            selected={minuteToString(Number(values.range_period))} 
                            onClick={setPeriod} 
                        /> 
                    </>
                }


                {/*********** CONSTANT ***********/}
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

            </form>

            </Slidein>
        </Flex>
    )
}

export default Create