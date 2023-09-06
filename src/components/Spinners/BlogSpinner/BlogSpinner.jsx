import './BlogSpinner.css';

export default function BlogSpinner(props) {
  return (
    <div className='spinneredStone' style={{ ...props.spinneredStyle }}>
      <div className='headedStone' style={{ ...props.headedStyle }}></div>
    </div>
  );
}
