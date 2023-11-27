declare interface NumWire {}
declare interface VecWire {}
declare interface BoolWire {}
declare interface RotWire {}
declare interface ObjWire {}
declare interface ConWire {}

declare function win(): void;
declare function lose(): void;

declare enum Touching {
  Touching = 'touching',
  Begins = 'begins',
  Ends = 'ends',
}
declare enum Count {
  First = "first",
  Second = "second",
  Third = "third",
}

declare function onTouch(
  touching: Touching,
  count: Count,
  callback: (screenX: NumWire, screenY: NumWire) => void
): [NumWire, NumWire];
