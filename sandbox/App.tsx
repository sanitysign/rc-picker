import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import Picker from '../src';
import { RangePicker } from '../src';
import dayjsGenerateConfig from '../src/generate/dayjs';
import type { PresetDate } from '@/interface';
import type { RangeValue } from '@/interface';
import CalendarLocaleRu from '../src/locale/ru_RU';
import CalendarLocaleEn from '../src/locale/en_US';

import './index.scss';

const props = {
  onOk: (val) => {
    // console.log(val)
  },
  generateConfig: dayjsGenerateConfig,
  locale: CalendarLocaleRu,
  suffixIcon: true,
  direction: 'ltr' as const,
  // showTime: true,
  allowClear: true,
  showAllNavButtons: false,
  vertical: true,
  // okBtn: true,
  format: "D MMM YYYY"
};

// console.log(dayjs().weekday(1).toDate())
// console.log(dayjs().startOf('w').toDate());

const rangePresets: PresetDate<RangeValue<dayjs.Dayjs>>[] = [
  {
    label: 'Вчера',
    value: () => {
      const now = dayjs();
      return [now.add(-1, 'd'), now.add(-1, 'd')];
    },
  },
  {
    label: 'Текущая неделя',
    value: () => {
      const now = dayjs();
      return [now.startOf('w').add(1, 'd'), now];
    },
  },
  {
    label: 'Последние 7 дней',
    value: () => {
      const now = dayjs();
      return [now.add(-7, 'd'), now.add(-1, 'd')];
    },
  },
  {
    label: 'Прошлая неделя',
    value: () => {
      const prevWeek = dayjs().add(-1, 'w');
      return [prevWeek.startOf('w').add(1, 'd'), prevWeek.endOf('w').add(1, 'd')];
    },
  },
  {
    label: 'Последние 14 дней',
    value: () => {
      const now = dayjs();
      return [now.add(-14, 'd'), now.add(-1, 'd')];
    },
  },
  {
    label: 'Текущий месяц',
    value: () => {
      const now = dayjs();
      return [now.startOf('M'), now];
    },
  },
  {
    label: 'Последние 30 дней',
    value: () => {
      const now = dayjs();
      return [now.add(-30, 'd'), now.add(-1, 'd')];
    },
  },
  {
    label: 'Прошлый месяц',
    value: () => {
      const prevMonth = dayjs().add(-1, 'M');
      return [prevMonth.startOf('M'), prevMonth.endOf('M')];
    },
  },
];

const App = () => {
  return (
    <div>
      <div className="pickers-row">
        <Picker {...props} placeholder="Select date"/>
        <RangePicker
          {...props}
          placeholder={['Select start date', 'Select end date']}
          presets={rangePresets}
        />
        {/* <RangePicker {...props} placeholder={["Select start date", "Select end date"]} presets={rangePresets} showTime/> */}
      </div>

      {/* <div className="spacer"></div> */}

      {/* <div className="pickers-row">
        <RangePicker {...props} placeholder={["Select start date", "Select end date"]} presets={rangePresets} />
        <RangePicker {...props} placeholder={["Select start date", "Select end date"]} presets={rangePresets} />
      </div> */}
    </div>
  );
};

export default App;
