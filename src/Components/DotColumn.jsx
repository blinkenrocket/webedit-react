// @flow
import React from 'react';
import type { List } from 'immutable';

type Props = {
  column: List<boolean>,
  row: number,
  mouseDownCallback?: Function,
  mouseUpCallback?: Function,
  mouseOverCallback?: Function,
};

const ON = 'red';
const OFF = 'slategrey';

export default class DotColumn extends React.Component<Props> {
  render() {
    const { column, row, mouseDownCallback, mouseUpCallback, mouseOverCallback } = this.props;

    return (
      <g>
        {column.map((on, index) => (
          <circle
            key={index}
            r="10"
            cy={index * 25 + 15}
            cx={row * 25 + 15}
            fill={on ? ON : OFF}
            onMouseDown={mouseDownCallback && mouseDownCallback.bind(this, index, row)}
            onMouseUp={mouseUpCallback && mouseUpCallback.bind(this, index, row)}
            onMouseOver={mouseOverCallback && mouseOverCallback.bind(this, index, row)}
          />
        ))}
      </g>
    );
  }
}
