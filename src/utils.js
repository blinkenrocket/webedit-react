// @flow
import { flatten, range, padStart } from 'lodash';
import { Map, List } from 'immutable';
import font from 'font';

const EMPTY_COLUMN = List(range(8).map(() => false));

const _cache_size = 100;
const textColumnsCache = new Proxy({}, {
  set: (obj, prop, value) => {
    // evict prefixes
    Object.keys(obj)
      .reduce((acc, cur) => prop.startsWith(cur) ? acc.concat(cur) : acc, [])
      .map(str => { delete(obj[str]); console.log('cache: evicted substr', str); });
    // limit number of cache entries; evict random value if necessary
    if (Object.keys(obj).length > _cache_size) {
      const idx = Math.floor(Math.random() * _cache_size);
      const evict = Object.keys(obj)[idx];
      delete(obj[evict]);
      console.log('cache: full, eviting', evict)
    }
    obj[prop] = value;
    return true;
  }
})


export function textColumns(txt: string) {
  let result = textColumnsCache[txt];
  if (!result) {
    result = textColumnsCache[txt] = List(
      flatten((txt || '').split('')
        .map(s => s.charCodeAt(0).toString())
        .map(c => font[c].hexcolumns.map((hexColumn: number) => padStart(hexColumn.toString(2), 8, '0')))
        .map(column => column.map(c => List(c.split('').map(x => x !== '0'))).concat([EMPTY_COLUMN]))
      )
    );
  }
  return result;
}
  
export function getFrameColumns(animation: Animation, frame: number) {
  if (animation.type === 'text') {
    const allColumns = textColumns(animation.text);
    let visibleCols = allColumns.slice(frame, frame + 8);
    let c = 0;
    while (visibleCols.size < 8) {
      // roll-over to beginning of allColumns at the end
      const col = allColumns.get(c);
      if (!col) {
        break;
      }
      visibleCols = visibleCols.push(col);
      c = (c + 1) % allColumns.size;
    }
    return visibleCols;
  } else if (animation.type === 'pixel') {
    return animation.animation.data.slice(8 * frame, 8 * frame + 8)
      .map((hexColumn: number) => padStart(hexColumn.toString(2), 8, '0'))
      .map(column => List(column.split('').map(x => x !== '0')));
  }
}

export function numFrames(animation: Animation) {
  if (animation.type === 'pixel') {
    return animation.animation.frames;
  } else if (animation.type === 'text') {
    return textColumns(animation.text).size;
  }
  return 0;
}

export function lastFrameIndex(animation: Animation) {
  if (animation.type === 'pixel') {
    return animation.animation.frames - 1;
  } else if (animation.type === 'text') {
    if (animation.direction) { 
      return 0;
    } else {
      return textColumns(animation.text).size - 9; 
    }
  }
  return 0;
}
