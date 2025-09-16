import '../index.css';

interface ButtonProps {
  title: string;
  type: 'button' | 'submit' | 'reset';
  disabled: boolean;
  styleType: 'btn-primary' | 'btn-secondary';
}

export function Button({ title, type, disabled, styleType }: ButtonProps) {
  return (
    <button 
    type={type}
    disabled={disabled} 
    className={styleType}>
        {title}
    </button>
  );
}

export default Button;