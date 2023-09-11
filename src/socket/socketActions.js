export const socketActions = {
  // BUILT IN
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  //COMPILER
  COMPILE_ON: 'Compile_ON',
  COMPILE_OFF: 'COMPILE_OFF',

  //MESSAGE
  CLIENT_MSG: 'clientMsg',
  SERVER_MSG: 'serverMsg',
  CONTEST_MSG: 'Contest-Msg',

  //USER JOIN
  JOIN: 'join',
  TAKE_INITIAL_IO: 'takeInitialIO',
  SEND_INITIAL_IO: 'sendInitialIO',
  IO_RECEIVED: 'IO_recieved',
  CHANGE_IO: 'changeIO',
  PEOPLE_IN_ROOM: 'peopleInRoom',

  //FETCHING PROBLEMS
  CODEFORCES_PROBLEM: 'codeforces-problem',
  PROBLEM: 'problem',

  //CONTEST RELATED
  CONTEST_STARTING: 'Contest-Starting',
  CONTEST_JOIN: 'Contest-Join',
  START_CONTEST: 'Start-Contest',
  CONTEST_UPDATE: 'Contest-Update',
  LEAVE_CONTEST: 'Leave-Contest',
  UPDATE: 'Update',

  //COLLAB DRAW
  COLLAB_DRAW_JOIN: 'collab-draw-join',
  WHITEBOARD_STATE: 'whiteboard-state',
  ELEMENT_UPDATE: 'element-update',
  WHITEBOARD_CLEAR: 'whiteboard-clear',
  CURSOR_POSITION: 'cursor-position',
  COLLAB_DRAW_USER_DISCONNECTED: 'collab-draw-user-disconnected',
};
