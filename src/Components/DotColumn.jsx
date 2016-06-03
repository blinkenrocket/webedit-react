// @flow
import React from 'react';
import type { List } from 'immutable';


type Props = {
  column: List<bool>,
  row: number,
  callback: () => void,
}

const ON = 'red';
const OFF = 'slategrey';

export default class DotColumn extends React.Component {
  props: Props;
  render() {
    const { column, row, callback } = this.props;
    return (
      <g>
        {column.map((on, index) => (
          <circle key={index} r="10" cy={index * 25 + 15} cx={row * 25 + 15} fill={on ? ON : OFF} onClick={callback && callback.bind(this, index, row)} />
        ))}
      </g>
    );
  }
}
