import * as React from 'react';
import type { GenerateConfig } from '../../generate';
import type { CellRender, Locale } from '../../interface';
import { formatValue, isSameQuarter } from '../../utils/dateUtil';
import RangeContext from '../../RangeContext';
import useCellClassName from '../../hooks/useCellClassName';
import type { ModifyCellClassNamesT } from '../../hooks/useCellClassName';
import PanelBody from '../PanelBody';

export const QUARTER_COL_COUNT = 4;
const QUARTER_ROW_COUNT = 1;

export type QuarterBodyProps<DateType> = {
  prefixCls: string;
  locale: Locale;
  generateConfig: GenerateConfig<DateType>;
  value?: DateType | null;
  viewDate: DateType;
  disabledDate?: (date: DateType) => boolean;
  onSelect: (value: DateType) => void;
  cellRender?: CellRender<DateType>;
} & ModifyCellClassNamesT<DateType>;

function QuarterBody<DateType>(props: QuarterBodyProps<DateType>) {
  const { prefixCls, locale, value, viewDate, generateConfig, cellRender, modifyCellClassNames } = props;

  const { rangedValue, hoverRangedValue } = React.useContext(RangeContext);

  const cellPrefixCls = `${prefixCls}-cell`;

  const getCellClassName = useCellClassName({
    cellPrefixCls,
    value,
    generateConfig,
    rangedValue,
    hoverRangedValue,
    isSameCell: (current, target) => isSameQuarter(generateConfig, current, target),
    isInView: () => true,
    offsetCell: (date, offset) => generateConfig.addMonth(date, offset * 3),
    modifyCellClassNames,
  });

  const baseQuarter = generateConfig.setDate(generateConfig.setMonth(viewDate, 0), 1);


  const getCellNode = cellRender
    ? (date: DateType, wrapperNode: React.ReactElement) =>
        cellRender(date, {
          originNode: wrapperNode,
          locale,
          today: generateConfig.getNow(),
          type: 'quarter',
        })
    : undefined;

  return (
    <PanelBody
      {...props}
      rowNum={QUARTER_ROW_COUNT}
      colNum={QUARTER_COL_COUNT}
      baseDate={baseQuarter}
      getCellNode={getCellNode}
      getCellText={date =>
        formatValue(date, {
          locale,
          format: locale.quarterFormat || '[Q]Q',
          generateConfig,
        })
      }
      getCellClassName={getCellClassName}
      getCellDate={(date, offset) => generateConfig.addMonth(date, offset * 3)}
      titleCell={date =>
        formatValue(date, {
          locale,
          format: 'YYYY-[Q]Q',
          generateConfig,
        })
      }
    />
  );
}

export default QuarterBody;
