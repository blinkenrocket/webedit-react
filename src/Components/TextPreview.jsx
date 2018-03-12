// @flow
import { flatten, padStart, range } from 'lodash';
import { List } from 'immutable';
import DotColumn from './DotColumn';
import font from 'font';
import React from 'react';

type Props = {
  delay: ?number,
  livePreview: boolean,
  rtl: boolean,
  speed: ?number,
  text: string,
};

type State = {
  currentStart: number,
  columns: List<List<boolean>>,
};

const style = {
  flexShrink: 0,
  overflow: 'auto',
};

const EMPTY_COLUMN = List(range(8).map(() => false));

export default class TextPreview extends React.Component<Props, State> {
  static defaultProps = {
    text: '',
  };
  state: State = {
    currentStart: 0,
    columns: List(),
  };
  interval: number;
  timeout: ?number;
  componentWillMount() {
    this.updateColumns(this.props);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  componentWillReceiveProps(nextProps: Props) {
    this.updateColumns(nextProps);
  }
  updateColumns(props: Props) {
    const { text, livePreview, rtl, delay } = props;
    const charCodes = (text || '').split('').map(s => s.charCodeAt(0).toString());

    this.setState({
      columns: List(
        flatten(
          charCodes
            .map(c => font[c].hexcolumns.map((hexColumn: number) => padStart(hexColumn.toString(2), 8, '0')))
            .map(column => column.map(c => List(c.split('').map(x => x !== '0'))).concat([EMPTY_COLUMN]))
        )
      ),
    });
    clearInterval(this.interval);
    clearTimeout(this.timeout);
    if (livePreview) {
      const speed = 1000 / (1 / (0.002048 * (250 - 16 * (this.props.speed || 1))));
      const updateFn = () => {
        const currentStart = (this.state.currentStart + (rtl ? -1 : 1)) % this.state.columns.size;

        if (currentStart === this.state.columns.size - Math.min(8, this.state.columns.size - 2)) {
          clearInterval(this.interval);
          this.timeout = setTimeout(() => {
            this.interval = setInterval(updateFn, speed);
          }, (delay || 1) * 1000);
        }
        this.setState({
          currentStart: (this.state.currentStart + (rtl ? -1 : 1)) % this.state.columns.size || 0,
        });
      };

      this.interval = setInterval(updateFn, speed);
    }
  }

  render() {
    const { columns, currentStart } = this.state;
    const { livePreview } = this.props;
    let visibleCols;

    if (livePreview) {
      visibleCols = columns.slice(currentStart, currentStart + 8);
      let c = 0;

      while (visibleCols.size < 8) {
        const col = columns.get(c);

        if (!col) {
          break;
        }
        visibleCols = visibleCols.push(col);
        c = (c + 1) % columns.size;
      }
    } else {
      visibleCols = columns;
    }
    const width = visibleCols.size * 25 + 5;

    return (
      <div style={style}>
        <svg height="205" width={width}>
          <rect height="205" width={width} x="0" y="0" fill="black" />
          {visibleCols && visibleCols.map((col, i) => <DotColumn key={i} column={col} row={i} />)}
        </svg>
      </div>
    );
  }
}
