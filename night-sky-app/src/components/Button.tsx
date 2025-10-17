import "../styles/index.css";
import leftArrow from "../assets/left-arrow.svg";

interface ButtonProps {
  title: string;
  type: "button" | "submit" | "reset";
  disabled: boolean;
  styleType: "btn-primary" | "btn-secondary" | "cookie-btn cookie-btn-save";
}

export function Button({ title, type, disabled, styleType }: ButtonProps) {
  return (
    <button type={type} disabled={disabled} className={styleType}>
      <img
        src={leftArrow}
        alt="Left Arrow"
        height={21}
        width={22}
        className="left-arrow"
      />
      {title}
    </button>
  );
}

export default Button;
