import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { TimePicker } from 'antd';
import { IconTimerPlay, IconTimerStop } from '@assets/index';

import './Timer.scss';

interface ITimerProps {}

const Timer = ({}: ITimerProps) => {
  const defaultTime = dayjs('0:45', 'm:ss');
  const [launch, setLaunch] = useState<boolean>(false);
  const [counter, setCounter] = useState<Dayjs>(defaultTime);

  useEffect(() => {
    let interval: any;

    if (launch)
      interval = setInterval(() => {
        setCounter(counter.subtract(1, 'seconds'));
        console.log(counter);
      }, 1000);

    if (counter.second() === 0 && counter.minute() === 0) {
      if (navigator.vibrate)
        navigator.vibrate([50, 50, 50, 500, 50, 50, 50, 500, 50, 50, 50]);
      clearInterval(interval);
      setLaunch(false);
      setCounter(defaultTime);
    }

    return () => clearInterval(interval);
  }, [counter, launch, setLaunch]);

  if (launch)
    return (
      <div className="timer mt-4 mb-1">
        <IconTimerStop
          onClick={() => setLaunch(false)}
          width={30}
          height={30}
        />
        <p
          className="m-0"
          style={{
            fontSize: '1.2rem',
            paddingRight: '1.2rem',
            fontWeight: 'bold'
          }}>
          {counter.format('m:ss').toString()}
        </p>
      </div>
    );

  return (
    <div className="timer mt-4 mb-1">
      <IconTimerPlay onClick={() => setLaunch(true)} width={30} height={30} />
      <TimePicker
        defaultValue={defaultTime}
        value={counter}
        onChange={(djs) => setCounter(djs)}
        className="antd-timer"
        size="small"
        variant="borderless"
        suffixIcon={<div></div>}
        style={{ color: 'white' }}
        format="m:ss"
        showNow={false}
        minuteStep={1}
        secondStep={15}
        allowClear={false}
        inputReadOnly
        disabled={launch}
      />
    </div>
  );
};

export default Timer;
