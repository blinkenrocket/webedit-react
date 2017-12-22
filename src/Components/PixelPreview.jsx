// @flow
import { List } from 'immutable';
import { padStart } from 'lodash';
import DotColumn from './DotColumn';
import React from 'react';

type Props = {
  cursor: any,
  data: List<number>,
  frame: number,
  mouseUpCallback?: Function,
  mouseDownCallback?: Function,
  mouseOverCallback?: Function,
};

type State = {
  currentStart: number,
  columns: List<List<boolean>>,
};

const style = {
  flexShrink: 0,
  overflow: 'auto',
  cursor: 'default',

  // avoid dragging the whole preview in FireFox
  UserSelect: 'none',
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
};

export default class PixelPreview extends React.Component<Props, State> {
  state: State = {
    currentStart: 0,
    columns: List(),
  };

  componentWillMount() {
    this.updateColumns(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.updateColumns(nextProps);
  }

  updateColumns(props: Props) {
    const { data, frame } = props;
    let frameData = data.slice(8 * frame, 8 * frame + 8);

    frameData = frameData.map((hexColumn: number) => padStart(hexColumn.toString(2), 8, '0'));
    frameData = frameData.map(column => List(column.split('').map(x => x !== '0')));

    this.setState({
      columns: (frameData: any),
    });
  }

  render() {
    const { cursor, mouseUpCallback } = this.props;
    const { columns } = this.state;
    const cols = List(columns);
    const width = cols.size * 25 + 5;
    const currentStyle = { ...style, cursor };

    return (
      <div
        style={currentStyle}
        onMouseUp={mouseUpCallback && mouseUpCallback.bind(this)}
        onMouseLeave={mouseUpCallback && mouseUpCallback.bind(this)}
        draggable="false"
      >
        <svg height="205" width={width}>
          <rect height="205" width={width} x="0" y="0" fill="black" />
          {cols &&
            cols.map((col, i) => (
              <DotColumn
                key={i}
                column={col}
                row={i}
                mouseDownCallback={this.props.mouseDownCallback}
                mouseUpCallback={this.props.mouseUpCallback}
                mouseOverCallback={this.props.mouseOverCallback}
              />
            ))}
        </svg>
      </div>
    );
  }
}
