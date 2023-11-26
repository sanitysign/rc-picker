import { useRef, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import Picker from '../src';
import { RangePicker } from '../src';
import dayjsGenerateConfig from '../src/generate/dayjs';
import CalendarLocaleRu from '../src/locale/ru_RU';
import CalendarLocaleEn from '../src/locale/en_US';
import { singlePresets, rangePresets } from './utils';

import type { PickerRefConfig } from '../src/Picker';

import './index.scss';

const props = {
  generateConfig: dayjsGenerateConfig,
  locale: CalendarLocaleRu,
  suffixIcon: true,
  direction: 'ltr' as const,
  // showTime: true,
  allowClear: true,
  showAllNavButtons: false,
  // vertical: true,
  // okBtn: true,
  format: 'D MMM YYYY',
};

const App = () => {
  const ref = useRef<PickerRefConfig>();

  const [date, setDate] = useState(null);

  return (
    <div>
      <div className="pickers-row">
        <Picker {...props} placeholder="Select date" presets={singlePresets} okBtn />
        <RangePicker
          {...props}
          value={date}
          onChange={(val) => {
            // console.log(val)
            setDate(val);
          }}
          placeholderStart="Select start date"
          placeholderEnd="Select end date"
          presets={rangePresets}
          ref={ref as any}
          okBtn
          // open
          // onOpenChange={(...args) => console.log(2, args)}
        />
        {/* <RangePicker
          {...props}
          placeholder={['Select start date', 'Select end date']}
          // presets={rangePresets}
          showTime={false}
        /> */}
      </div>
    </div>
  );
};

export default App;
