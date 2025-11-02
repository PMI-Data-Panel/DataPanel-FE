interface ButtonProps {
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  text: string;
  isLoading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({
  variant = "primary",
  size = "md",
  text,
  onClick,
  disabled,
  isLoading,
}: ButtonProps) => {
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-2.5 text-lg",
    xl: "px-6 py-3 text-xl",
    "2xl": "px-8 py-4 text-2xl",
  };

  return (
    <button
      className={`
        ${sizeStyles[size]}
        
        border-none
        rounded-3xl 
        font-medium 
        ${variantStyles[variant]}
        
        cursor-pointer 
        transition-all
        duration-200 
        
        hover:bg-blue-800
        active:scale-95

        disabled:opacity-60 
        disabled:cursor-not-allowed 
        disabled:!bg-gray-500"
         `}
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? "로딩 중..." : text}
    </button>
  );
};

export default Button;
