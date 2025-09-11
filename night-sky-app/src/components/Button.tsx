import '../index.css';

interface ButtonProps {
  title: string;
  disabled: boolean;
  buttonType: 'btn-primary' | 'btn-secondary';
}

function Button({ title, disabled, buttonType }: ButtonProps) {
  return (
    <button 
    disabled={disabled} 
    className={buttonType}>
        {title}
    </button>
  );
}

export default Button;