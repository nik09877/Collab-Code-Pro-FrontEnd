import { AlertTitle, Alert, Snackbar } from '@mui/material';

// import MuiAlert from '@material-ui/lab/Alert';
// function Alert(props) {
//   return <MuiAlert variant='filled' {...props} />;
// }

//Messaage Pop Up
const Snacker = (props) => {
  const { timer = 3000, message, severity, open } = props;

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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
