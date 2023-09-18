import { useRef } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import Picker from '../src';
import { RangePicker } from '../src';
import dayjsGenerateConfig from '../src/generate/dayjs';
import CalendarLocaleRu from '../src/locale/ru_RU';
import CalendarLocaleEn from '../src/locale/en_US';

import type { RangeValue, PresetDate } from '../src/interface';
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

const rangePresets: PresetDate<RangeValue<dayjs.Dayjs>>[] = [
  {
    label: 'Yesterday',
    value: () => {
      const now = dayjs();
      return [now.add(-1, 'd'), now.add(-1, 'd')];
    },
  },
  {
    label: 'This week',
    value: () => {
      const now = dayjs()
      const start = now.day() === 0 ? now.add(-1, "w").startOf("w") : now.startOf("w")
      return [start.add(1, "d"), now]
    },
  },
  {
    label: 'Last 7 days',
    value: () => {
      const now = dayjs();
      return [now.add(-7, 'd'), now.add(-1, 'd')];
    },
  },
  {
    label: 'Last week',
    value: () => {
      const now = dayjs()
      const prevWeek = dayjs().add(now.day() === 0 ? -2 : -1, "w")
      return [prevWeek.startOf("w").add(1, "d"), prevWeek.endOf("w").add(1, "d")]
    },
  },
  {
    label: 'Last 14 days',
    value: () => {
      const now = dayjs();
      return [now.add(-14, 'd'), now.add(-1, 'd')];
    },
  },
  {
    label: 'This month',
    value: () => {
      const now = dayjs();
      return [now.startOf('M'), now];
    },
  },
  {
    label: 'Last 30 days',
    value: () => {
      const now = dayjs();
      return [now.add(-30, 'd'), now.add(-1, 'd')];
    },
  },
  {
    label: 'Last month',
    value: () => {
      const prevMonth = dayjs().add(-1, 'M');
      return [prevMonth.startOf('M'), prevMonth.endOf('M')];
    },
  },
];

const App = () => {
  const ref = useRef<PickerRefConfig>();

  return (
    <div>
      <div className="pickers-row">
        <Picker {...props} placeholder="Select date" />
        <RangePicker
          {...props}
          placeholderStart="Select start date"
          placeholderEnd="Select end date"
          presets={rangePresets}
          ref={ref as any}
        />
        <RangePicker
          {...props}
          placeholder={['Select start date', 'Select end date']}
          // presets={rangePresets}
          showTime={false}
        />
      </div>
    </div>
  );
};

export default App;
