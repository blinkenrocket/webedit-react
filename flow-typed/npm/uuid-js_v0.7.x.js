// flow-typed signature: 8d92c12b273795407d7b8f5772e177b5
// flow-typed version: da30fe6876/uuid-js_v0.7.x/flow_>=v0.25.x

declare module "uuid-js" {
  declare class UUID<V> {
    fromParts(
      timeLow: mixed,
      timeMid: mixed,
      timeHiAndVersion: mixed,
      clockSeqHiAndReserved: mixed,
      clockSeqLow: mixed,
      node: mixed
    ): mixed;
    hex: string;
    toBytes(): Array<mixed>;
    toString(): string;
    toURN(): string;
    version: V;
  }
  declare function create(version?: 4): UUID<4>;
  declare function create(version: 1): UUID<1>;
  declare function firstFromTime(time: number): UUID<1>;
  declare function fromBinary(binary: mixed): UUID<*>;
  declare function fromBytes(bytes: number[]): UUID<*>;
  declare function fromURN(string: string): UUID<*>;
  declare function lastFromTime(time: number): UUID<1>;
}
