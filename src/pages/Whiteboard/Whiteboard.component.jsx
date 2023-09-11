import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import rough from 'roughjs/bundled/rough.esm';
import { useDispatch, useSelector } from 'react-redux';
import { actions, cursorPositions, toolTypes } from '../../utils/constants';
import {
  drawElement as utilDrawElement,
  createElement as utilCreateElement,
  updateElement as utilUpdateElement,
  adjustmentRequired as utilAdjustmentRequired,
  adjustElementCoordinates as utilAdjustElementCoordinates,
  getElementAtPosition as utilGetElementAtPosition,
  getCursorForPosition as utilGetCursorForPosition,
  getResizedCoordinates as utilGetResizedCoordinates,
  updatePencilElementWhenMoving as utilUpdatePencilElementWhenMoving,
} from '../../utils/utilFunctions';
import { v4 as uuid } from 'uuid';
import { setElements, updateElement } from '../../store/whiteboardSlice';

import Menu from './components/Menu.component';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { initSocket } from '../../socket/socket';
import { socketActions } from '../../socket/socketActions';
import {
  removeCursorPosition,
  updateCursorPosition,
} from '../../store/cursorSlice';
import { useSnackbar } from 'notistack';
import ContestSpinner from '../../components/Spinners/ContestSpinner/ContestSpinner';

//no need to maintain their states
let emitCursor = true;
let lastCursorPosition;

const Whiteboard = () => {
  const [action, setAction] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [joined, setJoined] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const canvasRef = useRef();
  const textAreaRef = useRef();
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const userName = searchParams.get('userName');

  const toolType = useSelector((state) => state.whiteboard.tool);
  const elements = useSelector((state) => state.whiteboard.elements);
  const dispatch = useDispatch();

  //HANDLERS
  const handleErrors = (_, msg) => {
    navigate('/home', {
      state: { err: `${msg}` },
      replace: true,
    });
  };

  //SIDE EFFECT
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) =>
        handleErrors(err, 'Socket connection failed, try again later')
      );
      socketRef.current.on('connect_failed', (err) =>
        handleErrors(err, 'Socket connection failed, try again later')
      );

      socketRef.current.emit(
        socketActions.COLLAB_DRAW_JOIN,
        { userName, roomId },
        ({ error, user }) => {
          if (error) {
            return handleErrors({ error }, error);
          }
          setJoined(true);
        }
      );

      //listen to when new user joins
      socketRef.current.on(socketActions.COLLAB_DRAW_JOIN, (user) => {
        enqueueSnackbar(`${user.userName} joined the room!`, {
          variant: 'success',
          autoHideDuration: 2000,
        });
      });

      //listen to when server sends initial whiteboard state
      socketRef.current.on(socketActions.WHITEBOARD_STATE, (elements) => {
        // console.log('Received Initial IO');
        dispatch(setElements(elements));
      });

      ////listen to when server sends updated whiteboard state
      socketRef.current.on(socketActions.ELEMENT_UPDATE, (elementData) => {
        // console.log('Received Element Update');
        dispatch(updateElement(elementData));
      });

      socketRef.current.on(socketActions.WHITEBOARD_CLEAR, () => {
        // console.log('received whiteboard clear');
        dispatch(setElements([]));
      });

      //TODO LOOK AT THIS CURSOR DATA
      socketRef.current.on(socketActions.CURSOR_POSITION, (cursorData) => {
        // console.log('received cursor position');
        dispatch(updateCursorPosition(cursorData));
      });

      //TODO LOOK AT THIS REMOVECURSORPOSITION
      socketRef.current.on(
        socketActions.COLLAB_DRAW_USER_DISCONNECTED,
        (disconnectedUser) => {
          // console.log('user disconnected', disconnectedUser);
          dispatch(removeCursorPosition(disconnectedUser.id));
          enqueueSnackbar(`${disconnectedUser.userName} left the room!`, {
            variant: 'error',
            autoHideDuration: 2000,
          });
        }
      );
    };

    init();

    return () => {
      socketRef?.current?.disconnect();
      //Turn off those events which you have been listening to
      socketRef.current.off(socketActions.COLLAB_DRAW_JOIN);
      socketRef.current.off(socketActions.WHITEBOARD_STATE);
      socketRef.current.off(socketActions.ELEMENT_UPDATE);
      socketRef.current.off(socketActions.WHITEBOARD_CLEAR);
      socketRef.current.off(socketActions.CURSOR_POSITION);
      socketRef.current.off(socketActions.COLLAB_DRAW_USER_DISCONNECTED);
      // socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  useLayoutEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const roughCanvas = rough.canvas(canvas);

      elements.forEach((element) => {
        utilDrawElement({ roughCanvas, context: ctx, element });
      });
    }
  }, [elements]);

  ////////////////////////EVENT HANDLERS////////////////
  const handleMouseDown = (e) => {
    //GET MOUSE TOUCHDOWN POSITION
    const { clientX, clientY } = e;

    if (selectedElement && action === actions.WRITING) {
      return;
    }

    switch (toolType) {
      case toolTypes.RECTANGLE:
      case toolTypes.LINE:
      case toolTypes.PENCIL: {
        //CREATE DESIRED ELEMENT
        const element = utilCreateElement({
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
          toolType,
          id: uuid(),
        });
        setAction(actions.DRAWING);
        //SET ELEMENT TO LATEST ELEMENT
        setSelectedElement(element);
        //STORE IT IN THE GLOBAL STATE IF NOT PRESENT
        //OR ELSE UPDATE IT
        dispatch(updateElement(element));
        break;
      }
      case toolTypes.TEXT: {
        //CREATE DESIRED ELEMENT
        const element = utilCreateElement({
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
          toolType,
          id: uuid(),
        });
        setAction(actions.WRITING);
        //SET ELEMENT TO LATEST ELEMENT
        setSelectedElement(element);
        //STORE IT IN THE GLOBAL STATE IF NOT PRESENT
        //OR ELSE UPDATE IT
        dispatch(updateElement(element));
        break;
      }
      case toolTypes.SELECTION: {
        const element = utilGetElementAtPosition(clientX, clientY, elements);
        if (
          element &&
          (element.type === toolTypes.RECTANGLE ||
            element.type === toolTypes.TEXT ||
            element.type === toolTypes.LINE)
        ) {
          setAction(
            element.position === cursorPositions.INSIDE
              ? actions.MOVING
              : actions.RESIZING
          );
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;

          setSelectedElement({ ...element, offsetX, offsetY });
        }
        if (element && element.type === toolTypes.PENCIL) {
          setAction(actions.MOVING);

          const xOffsets = element.points.map((point) => clientX - point.x);
          const yOffsets = element.points.map((point) => clientY - point.y);
          //TODO ...elements
          setSelectedElement({ ...element, xOffsets, yOffsets });
        }
        break;
      }
    }
  };

  const handleMouseUp = () => {
    const selectedElementIndex = elements.findIndex(
      (el) => el.id === selectedElement?.id
    );
    if (selectedElementIndex !== -1) {
      if (action === actions.DRAWING || action === actions.RESIZING) {
        //If type is RECTANGLE OR LINE AND USER IS DRAWING FROM BOTTOM TO TOP
        //SWAP THE COORDINATES
        if (utilAdjustmentRequired(elements[selectedElementIndex].type)) {
          const { x1, y1, x2, y2 } = utilAdjustElementCoordinates(
            elements[selectedElementIndex]
          );
          const updatedElement = utilUpdateElement(
            {
              index: selectedElementIndex,
              id: selectedElement.id,
              x1,
              x2,
              y1,
              y2,
              type: elements[selectedElementIndex].type,
            },
            elements
          );
          socketRef.current.emit(socketActions.ELEMENT_UPDATE, updatedElement);
        }
      }
    }
    //NO MOUSE MOVE SO RESET ELEMENT
    setAction(null);
    setSelectedElement(null);
  };

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;

    //EMIT CURSOR POSITION TO OTHER CLIENTS
    lastCursorPosition = { x: clientX, y: clientY };
    if (emitCursor) {
      socketRef.current.emit(socketActions.CURSOR_POSITION, {
        x: clientX,
        y: clientY,
      });
      // emitCursorPosition({ x: clientX, y: clientY });
      emitCursor = false;
      setTimeout(() => {
        emitCursor = true;
        // emitCursorPosition(lastCursorPosition);
        socketRef.current.emit(
          socketActions.CURSOR_POSITION,
          lastCursorPosition
        );
      }, 50);
    }

    if (action === actions.DRAWING) {
      const index = elements.findIndex((el) => el.id === selectedElement.id);
      if (index !== -1) {
        const updatedElement = utilUpdateElement(
          {
            index,
            id: elements[index].id,
            x1: elements[index].x1,
            x2: clientX,
            y1: elements[index].y1,
            y2: clientY,
            type: elements[index].type,
          },
          elements
        );
        socketRef.current.emit(socketActions.ELEMENT_UPDATE, updatedElement);
      }
    }

    if (toolType === toolTypes.SELECTION) {
      const element = utilGetElementAtPosition(clientX, clientY, elements);
      event.target.style.cursor = element
        ? utilGetCursorForPosition(element.position)
        : 'default';
    }

    if (
      toolType === toolTypes.SELECTION &&
      action === actions.MOVING &&
      selectedElement.type === toolTypes.PENCIL
    ) {
      const newPoints = selectedElement.points.map((_, index) => ({
        x: clientX - selectedElement.xOffsets[index],
        y: clientY - selectedElement.yOffsets[index],
      }));
      const index = elements.findIndex((el) => el.id === selectedElement.id);
      if (index !== -1) {
        const updatedElement = utilUpdatePencilElementWhenMoving(
          { index, newPoints },
          elements
        );
        socketRef.current.emit(socketActions.ELEMENT_UPDATE, updatedElement);
      }
      return;
    }
    if (
      toolType === toolTypes.SELECTION &&
      action === actions.MOVING &&
      selectedElement
    ) {
      const { id, x1, y1, x2, y2, type, offsetX, offsetY, text } =
        selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;

      const newX1 = clientX - offsetX;
      const newY1 = clientY - offsetY;

      const index = elements.findIndex((el) => el.id === selectedElement.id);
      if (index !== -1) {
        const updatedElement = utilUpdateElement(
          {
            id,
            x1: newX1,
            y1: newY1,
            x2: newX1 + width,
            y2: newY1 + height,
            type,
            index,
            text,
          },
          elements
        );
        socketRef.current.emit(socketActions.ELEMENT_UPDATE, updatedElement);
      }
    }

    if (
      toolType === toolTypes.SELECTION &&
      action === actions.RESIZING &&
      selectedElement
    ) {
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = utilGetResizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates
      );

      const index = elements.findIndex((el) => el.id === selectedElement.id);
      if (index !== -1) {
        const updatedElement = utilUpdateElement(
          { index, id, x1, x2, y1, y2, type },
          elements
        );
        socketRef.current.emit(socketActions.ELEMENT_UPDATE, updatedElement);
      }
    }
  };

  const handleTextareaBlur = (event) => {
    const { id, x1, y1, type } = selectedElement;
    const index = elements.findIndex((el) => el.id === selectedElement.id);
    if (index !== -1) {
      const updatedElement = utilUpdateElement(
        { id, x1, y1, type, text: event.target.value, index },
        elements
      );
      socketRef.current.emit(socketActions.ELEMENT_UPDATE, updatedElement);
      setAction(null);
      setSelectedElement(null);
    }
  };

  return joined ? (
    <React.Fragment>
      <Menu socketRef={socketRef} />
      {action === actions.WRITING ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleTextareaBlur}
          style={{
            position: 'absolute',
            top: selectedElement.y1 - 3,
            left: selectedElement.x1,
            font: '24px sans-serif',
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            resize: 'auto',
            overflow: 'hidden',
            whiteSpace: 'pre',
            background: 'transparent',
          }}
        ></textarea>
      ) : null}
      <canvas
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        id='canvas'
      />
    </React.Fragment>
  ) : (
    <ContestSpinner />
  );
};

export default Whiteboard;
