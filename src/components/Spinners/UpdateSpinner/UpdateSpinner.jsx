import classes from './UpdateSpinner.module.css';

export default function UpdateSpinner() {
  return (
    <div className={classes.loader}>
      <div className={classes.bar}></div>
      <div className={classes.bar}></div>
      <div className={classes.bar}></div>
    </div>
  );
}
