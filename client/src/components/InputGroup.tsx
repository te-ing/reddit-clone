import React from 'react';

interface InputGroupProps {
  className?: string;
  type?: string;
  placeholder?: string;
  value: string;
  error: string | undefined;
  setValue: (str: string) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({
  className = 'mb-2',
  type = 'text',
  placeholder = '',
  error,
  value,
  setValue,
}) => {
  return (
    <div className={className}>
      <input
        type={type}
        style={{ minWidth: 300 }}
        className="w-full p-3 transition duration-200 border border-gray-400 rounded bg-grayy-50 focus:bg-white hover:bg-white"
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
};

export default InputGroup;
