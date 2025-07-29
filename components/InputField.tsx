import { ReactNode } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const InputField = ({ 
  label, 
  error, 
  leftIcon, 
  rightIcon, 
  className,
  ...props 
}: InputFieldProps) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 text-sm font-medium mb-2">
          {label}
        </Text>
      )}
      <View className={`flex-row items-center border border-gray-300 rounded-lg px-3 py-3 bg-white ${error ? 'border-red-500' : 'focus:border-blue-500'} ${className || ''}`}>
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          className="flex-1 text-gray-900"
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </View>
      {error && (
        <Text className="text-red-500 text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};
