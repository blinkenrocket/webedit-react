// @flow
import React from 'react';
import { List } from 'immutable';

type Props = {
  columns: List<List<boolean>>,
  style: any,
  size: string,
  onClick?: Function,
  mouseUpCallback?: Function,
  mouseDownCallback?: Function,
  mouseOverCallback?: Function,
};

const style = {
  flexShrink: 0,
  display: 'block',

  // avoid dragging the whole preview in FireFox
  UserSelect: 'none',
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
};

const sizes = {
  thumb: 2,
  gallery: 5,
  small: 10,
  mid: 15,
  huge: 20,
};

const DotColumn = ({data, row, radius, offColor, cursor, mouseDownCallback, mouseUpCallback, mouseOverCallback}) => (
  <g>
    {data.map((on, index) => (
      <circle
        key={index}
        r={radius}
        cy={index * (radius * 2.5) + (radius * 1.5)}
        cx={row * (radius * 2.5) + (radius * 1.5)}
        fill={on ? 'red' : (offColor || 'slategrey')}
        style={{cursor: cursor}}
        onMouseDown={mouseDownCallback && mouseDownCallback.bind(this, index, row)}
        onMouseUp={mouseUpCallback && mouseUpCallback.bind(this, index, row)}
        onMouseOver={mouseOverCallback && mouseOverCallback.bind(this, index, row)}
      />
    ))}
  </g>
);

export default class Frame extends React.Component<Props, State> {
  static defaultProps = { size: 'small', offColor: 'slategrey' };

  render() {
    const { columns, size, mouseUpCallback } = this.props;
    const radius = sizes[size];
    const width = 8 * (radius * 2.5) + (radius * 0.5);
    const currentStyle = { ...style, ...this.props.style };

    return (
      <div
        style={currentStyle}
        onClick={this.props.onClick}
        onMouseUp={mouseUpCallback && mouseUpCallback.bind(this)}
        onMouseLeave={mouseUpCallback && mouseUpCallback.bind(this)}
        draggable="false"
      >
        <svg height={width} width={width} style={{display: 'block'}}>
          <rect height={width}  width={width} x="0" y="0" fill="black" />
          { columns.map((col, i) => (
              <DotColumn
                data={col}
                radius={radius}
                key={i}
                row={i}
                cursor={ this.props.mouseDownCallback && 'pointer' || 'default' }
                offColor={this.props.offColor}
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

