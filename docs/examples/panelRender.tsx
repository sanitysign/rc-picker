import type { Moment } from 'moment';
import moment from 'moment';
import React from 'react';
import '../../assets/index.scss';
import momentGenerateConfig from '../../src/generate/moment';
import enGb from '../../src/locale/en_GB';
import Picker from '../../src/Picker';
import RangePicker from '../../src/RangePicker';
import './common.scss';

const defaultStartValue = moment('2019-09-03 05:02:03');
const defaultEndValue = moment('2019-11-28 01:02:03');
const defaultValue: [Moment, Moment] = [defaultStartValue, defaultEndValue];

export default () => {
  const [customizeNode, setCustomizeNode] = React.useState(false);

  return (
    <>
      {String(customizeNode)}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div>
          <h3>Picker</h3>
          <Picker<Moment>
            generateConfig={momentGenerateConfig}
            locale={enGb}
            allowClear
            defaultValue={defaultStartValue}
            panelRender={(node) => (
              <>
                <button
                  type="button"
                  style={{ display: 'block' }}
                  onClick={() => {
                    setCustomizeNode(!customizeNode);
                  }}
                >
                  Change
                </button>

                {customizeNode ? <span>My Panel</span> : node}
              </>
            )}
          />
        </div>
        <div>
          <h3>RangePicker</h3>
          <RangePicker<Moment>
            generateConfig={momentGenerateConfig}
            locale={enGb}
            allowClear
            defaultValue={defaultValue}
            panelRender={(node) => (
              <>
                <button
                  type="button"
                  style={{ display: 'block' }}
                  onClick={() => {
                    setCustomizeNode(!customizeNode);
                  }}
                >
                  Change
                </button>
                {customizeNode ? <span>My Panel</span> : node}
              </>
            )}
          />
        </div>
      </div>
    </>
  );
};
