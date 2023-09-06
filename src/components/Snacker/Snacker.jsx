import { AlertTitle, Alert, Snackbar } from '@mui/material';

// import MuiAlert from '@material-ui/lab/Alert';
// function Alert(props) {
//   return <MuiAlert variant='filled' {...props} />;
// }

//Messaage Pop Up
const Snacker = (props) => {
  const { timer = 3000, message, severity, open } = props;
  const position = {
    vertical: props.vertical ? props.vertical : 'bottom',
    horizontal: props.horizontal ? props.horizontal : 'left',
  };

  return (
    <Snackbar
      anchorOrigin={position}
      open={open}
      autoHideDuration={timer}
      onClose={props.onClose}
    >
      <Alert onClose={props.onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Snacker;
