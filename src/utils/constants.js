export const toolTypes = {
  RECTANGLE: 'RECTANGLE',
  LINE: 'LINE',
  PENCIL: 'PENCIL',
  TEXT: 'TEXT',
  SELECTION: 'SELECTION',
  COPY: 'COPY',
  LEAVE: 'LEAVE',
  RUBBER: 'RUBBER',
};

export const actions = {
  DRAWING: 'DRAWING',
  WRITING: 'WRITING',
  MOVING: 'MOVING',
  RESIZING: 'RESIZING',
};

export const cursorPositions = {
  //FOR CHECKING IF CURSOR POINTS TO A RECTANGLE
  TOP_LEFT: 'TOP_LEFT',
  TOP_RIGHT: 'TOP_RIGHT',
  BOTTOM_LEFT: 'BOTTOM_LEFT',
  BOTTOM_RIGHT: 'BOTTOM_RIGHT',
  //FOR CHECKING IF CURSOR POINTS TO A LINE
  START: 'START',
  END: 'END',
  //FOR CHECKING IF CURSOR FALLS INSIDE AN ELEMENT
  INSIDE: 'INSIDE',
};