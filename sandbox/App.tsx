/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import Picker from '../src';
import { RangePicker } from '../src';
import dayjsGenerateConfig from '../src/generate/dayjs';
import CalendarLocaleRu from '../src/locale/ru_RU';
import CalendarLocaleEn from '../src/locale/en_US';
import { singlePresets, rangePresets } from './utils';
import PickerPanel from '../src/PickerPanel';

import Customize from '../docs/examples/customize';

import type { Dayjs } from 'dayjs';
import type { PickerRefConfig } from '../src/Picker';
import Toolbars from './Toolbars';

import './index.scss';

const props = {
  generateConfig: dayjsGenerateConfig,
  locale: CalendarLocaleEn,
  suffixIcon: true,
  // direction: 'ltr' as const,
  // showTime: true,
  allowClear: true,
  showAllNavButtons: false,
  // vertical: true,
  // okBtn: true,
  format: 'D MMM YYYY',
};

const App = () => {
  const ref = useRef<PickerRefConfig>();
  const refRange = useRef<PickerRefConfig>();

  const [date, setDate] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  return (
    <div
      onClick={(e) => {
        if (!e.altKey) return;
        ref.current?.focus();
      }}
    >
      <h1 className="title">Sandbox</h1>
      <div className="pickers-row">
        {/* <PickerPanel {...props} value={date} onChange={(val) => setDate(val)} /> */}

        {/* <Picker
          {...props}
          placeholder="Select date"
          presets={singlePresets}
          okBtn
          value={date}
          onChange={(val) => setDate(val)}
          ref={ref as any}
        />

        <RangePicker
          {...props}
          value={dateRange}
          onChange={(val) => setDateRange(val)}
          placeholderStart="Select start date"
          placeholderEnd="Select end date"
          placeholderStartInner="Start"
          placeholderEndInner="End"
          presets={rangePresets}
          ref={refRange as any}
          okBtn
          // vertical
          doublePanel={true}
        /> */}

        {/* <RangePicker
          {...props}
          placeholder={['Select start date', 'Select end date']}
          // presets={rangePresets}
          showTime={false}
        /> */}

        <Toolbars />
      </div>
    </div>
  );
};

export default App;
