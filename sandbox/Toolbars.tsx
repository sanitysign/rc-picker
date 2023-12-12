/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState } from 'react';

import Picker from '../src';
import { RangePicker } from '../src';
import dayjsGenerateConfig from '../src/generate/dayjs';
import CalendarLocaleRu from '../src/locale/ru_RU';
import CalendarLocaleEn from '../src/locale/en_US';
import { singlePresets, rangePresets, renderPresetsSingle, renderPresetsRange } from './utils';
import type { RenderPresetsRangeProps } from '../src/RangePicker';
import type { Dayjs } from "dayjs";

import type { PickerRefConfig } from '../src/Picker';

const props = {
  generateConfig: dayjsGenerateConfig,
  locale: CalendarLocaleEn,
  suffixIcon: true,
  // showTime: true,
  allowClear: true,
  showAllNavButtons: false,
  // vertical: true,
  // okBtn: true,
  format: 'D MMM YYYY',
  placeholderStart: 'Select start date',
  placeholderEnd: 'Select end date',
  placeholderStartInner: 'Start',
  placeholderEndInner: 'End',
};

const Toolbars = () => {
  const ref = useRef<PickerRefConfig>();
  const refRange = useRef<PickerRefConfig>();

  const refInner = useRef<PickerRefConfig>();
  const refRangeInner = useRef<PickerRefConfig>();

  const refToolbar = useRef<HTMLDivElement>();
  const refToolbarRange = useRef<HTMLDivElement>();

  const innerPresetsRef = useRef<RenderPresetsRangeProps<Dayjs>>()

  const [date, setDate] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  const [open, setOpen] = useState(false);
  const [openRange, setOpenRange] = useState(false);

  return (
    <>
      <Picker
        {...props}
        placeholder="Select date"
        // presets={singlePresets}
        okBtn
        cancelBtn
        value={date}
        onChange={(val) => setDate(val)}
        ref={ref as any}
        showInput={true}
        // showInnerInput={true}
        // onOpenChange={(open) => setOpen(open)}
        // toolbar={<div className="toolbar" ref={refToolbar}></div>}
        renderPresets={renderPresetsSingle}
      />

      {/* <Picker
        {...props}
        placeholder="Select date"
        // presets={singlePresets}
        // okBtn
        value={date}
        onChange={(val) => setDate(val)}
        ref={refInner as any}
        showInput={false}
        // showInnerInput={true}
        open={open}
        isClickInsidePicker={(target) =>
          !!(
            (target as HTMLElement).closest('.rc-picker') ||
            (target as HTMLElement).closest('.rc-picker-dropdown')
          )
        }
        getPopupContainer={() => refToolbar.current}
      /> */}

      <RangePicker
        {...props}
        value={dateRange}
        onChange={(val) => setDateRange(val)}
        // presets={rangePresets}
        ref={refRange as any}
        okBtn
        showInnerInput={true}
        // vertical
        toolbar={<div className="toolbar" ref={refToolbarRange}></div>}
        // doublePanel={false}
        // showInput={false}
        onOpenChange={(open) => setOpenRange(open)}
        // rangePanelTop={<h2>Top</h2>}
        // renderPresets={(props) => renderPresetsRange(props, innerPresetsRef)}
        renderPresets={renderPresetsRange}
        cancelBtn
      />

      <RangePicker
        {...props}
        value={dateRange}
        onChange={(val) => setDateRange(val)}
        ref={refRangeInner as any}
        showInnerInput={true}
        getPopupContainer={() => refToolbarRange.current}
        // doublePanel={false}
        showInput={false}
        open={openRange}
        isClickInsidePicker={(target) =>
          !!(
            (target as HTMLElement).closest('.rc-picker') ||
            (target as HTMLElement).closest('.rc-picker-dropdown')
          )
        }
        // rangePanelTop={<h2>Top</h2>}
        // renderPresets={props => {
        //   innerPresetsRef.current = props
        //   return null
        // }}
      />
    </>
  );
};

export default Toolbars;
