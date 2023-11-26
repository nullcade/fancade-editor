# Blocks and their equavilant in scripting

## Blocks with no input or output

| block name | Script   |
| ---------- | -------- |
| Win        | `win()`  |
| Lose       | `lose()` |

## Blocks with one callback

| block name     | Script                           |
| -------------- | -------------------------------- |
| Play Sensor    | `onPlay(callback: () => void)`   |
| Late Update    | `onUpdate(callback: () => void)` |
| Box Art Sensor | `onBoxArt(calback: () => void)`  |

## Blocks with value

| Block name   | Script                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Button       | `addButton(direction: boolean, callback: () => void)`                                                                                |
| Joystick     | `addJoystick(screen: boolean): [VecWire]`                                                                                            |
| Touch Sensor | `onTouch(touching: 0\|1\|2, count: 0\|1\|2, callback: (screenX: NumberWire, screenY: NumberWire) => void): [NumberWire, NumberWire]` |
| Variable     | `getVar(name: string): wire<T>`                                                                                                      |
| Set Variable | `setVar(name: string, value: wire<T>)`                                                                                               |
| Value        | `_(value: T): Wire<T>`                                                                                                               |
| Comment      | no                                                                                                                                   |

## Other blocks

### control

| Block name   | Script                                                       |
| ------------ | ------------------------------------------------------------ |
| if           | `if(condition: booleanWire) callIfTrue() else callIfFalse()` |
| Swipe Sensor | `onSwipe(callback: (direction: VecWire) => void): [VecWire]` |
| Collision | `onCollision(object: ObjWire, callback: (collidedObject: ObjWire, impulse: NumberWire, Normal: VecWire) => void): [ObjWire, NumberWire, VecWire]`|
||
