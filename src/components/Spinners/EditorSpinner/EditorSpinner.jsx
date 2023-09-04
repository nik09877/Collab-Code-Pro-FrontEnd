import Styles from './EditorSpinner.module.css';

export default function EditorSpinner() {
  return (
    <div class={Styles.spinner}>
      <div className={Styles.halfSpin}></div>
    </div>
  );
}
