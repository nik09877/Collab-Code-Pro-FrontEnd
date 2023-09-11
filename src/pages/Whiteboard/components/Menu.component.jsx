import React from 'react';
import IconButton from './IconButton.component';
import rectangleIcon from '../../../assets/icons/rectangle.svg';
import lineIcon from '../../../assets/icons/line.svg';
import rubberIcon from '../../../assets/icons/rubber.svg';
import pencilIcon from '../../../assets/icons/pencil.svg';
import textIcon from '../../../assets/icons/text.svg';
import selectionIcon from '../../../assets/icons/selection.svg';
import CopyIcon from '../../../assets/icons/copy-svgrepo-com.svg';
import CrossIcon from '../../../assets/icons/cross-svgrepo-com.svg';
import { toolTypes } from '../../../utils/constants';

const Menu = ({ socketRef }) => {
  return (
    <div className='menu_container'>
      <IconButton src={rectangleIcon} type={toolTypes.RECTANGLE} />
      <IconButton src={lineIcon} type={toolTypes.LINE} />
      <IconButton
        src={rubberIcon}
        type={toolTypes.RUBBER}
        isRubber={true}
        socketRef={socketRef}
      />
      <IconButton src={pencilIcon} type={toolTypes.PENCIL} />
      <IconButton src={textIcon} type={toolTypes.TEXT} />
      <IconButton src={selectionIcon} type={toolTypes.SELECTION} />
      <IconButton src={CopyIcon} type={toolTypes.COPY} copyIcon={true} />
      <IconButton
        src={CrossIcon}
        type={toolTypes.LEAVE}
        leaveIcon={true}
        socketRef={socketRef}
      />
    </div>
  );
};

export default Menu;
