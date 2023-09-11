import { useDispatch, useSelector } from 'react-redux';
import { setElements, setToolType } from '../../../store/whiteboardSlice';
import { socketActions } from '../../../socket/socketActions';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { removeAllCursors } from '../../../store/cursorSlice';
import Tooltip from '@mui/material/Tooltip';

const IconButton = ({
  src,
  type,
  isRubber,
  socketRef,
  copyIcon,
  leaveIcon,
}) => {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const selectedToolType = useSelector((state) => state.whiteboard.tool);
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const handleToolChange = () => {
    dispatch(setToolType(type));
  };
  const handleClearCanvas = () => {
    dispatch(setElements([]));
    socketRef.current.emit(socketActions.WHITEBOARD_CLEAR);
  };

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      enqueueSnackbar('Room Id Copied Succesfully !', {
        variant: 'success',
        autoHideDuration: 2000,
      });
    } catch (err) {
      enqueueSnackbar('Could not copy the Room ID', {
        variant: 'error',
        autoHideDuration: 2000,
      });
    }
  };

  const handleLeaveRoom = () => {
    if (!window.confirm('Are you sure you want to leave this room ?')) {
      return;
    }
    dispatch(removeAllCursors());
    return navigate('/home', {
      state: { err: 'You Left the Collab-Draw Room' },
      replace: true,
    });
  };

  return (
    <Tooltip title={type} arrow>
      <button
        onClick={
          isRubber
            ? handleClearCanvas
            : copyIcon
            ? handleCopyRoomId
            : leaveIcon
            ? handleLeaveRoom
            : handleToolChange
        }
        className={
          selectedToolType === type ? 'menu_button_active' : 'menu_button'
        }
      >
        <img src={src} alt='draw-button' width='80%' height='80%' />
      </button>
    </Tooltip>
  );
};

export default IconButton;
