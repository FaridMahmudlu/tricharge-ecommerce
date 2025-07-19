import React from 'react';
import styled from 'styled-components';

interface FormFieldProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  multiline?: boolean;
  rows?: number;
}

const FieldContainer = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input<{ hasError: boolean }>`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ hasError }) => (hasError ? '#dc3545' : '#ddd')};
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ hasError }) => (hasError ? '#dc3545' : '#4a90e2')};
  }

  &::placeholder {
    color: #999;
  }
`;

const TextArea = styled.textarea<{ hasError: boolean }>`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ hasError }) => (hasError ? '#dc3545' : '#ddd')};
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ hasError }) => (hasError ? '#dc3545' : '#4a90e2')};
  }

  &::placeholder {
    color: #999;
  }
`;

const Select = styled.select<{ hasError: boolean }>`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ hasError }) => (hasError ? '#dc3545' : '#ddd')};
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${({ hasError }) => (hasError ? '#dc3545' : '#4a90e2')};
  }
`;

const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 14px;
  margin-top: 4px;
  display: block;
`;

const Required = styled.span`
  color: #dc3545;
  margin-left: 4px;
`;

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  options,
  multiline = false,
  rows = 4,
}) => {
  const hasError = !!error;

  const renderField = () => {
    if (multiline) {
      return (
        <TextArea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          hasError={hasError}
        />
      );
    }

    if (options) {
      return (
        <Select name={name} value={value} onChange={onChange} hasError={hasError}>
          <option value="">Select {label}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    }

    return (
      <Input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        hasError={hasError}
      />
    );
  };

  return (
    <FieldContainer>
      <Label>
        {label}
        {required && <Required>*</Required>}
      </Label>
      {renderField()}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FieldContainer>
  );
};

export default FormField; 