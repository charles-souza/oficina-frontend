import { useState, useCallback } from 'react';
import * as Yup from 'yup';

interface ValidationErrors {
  [key: string]: string;
}

interface UseFormValidationReturn<T> {
  values: T;
  errors: ValidationErrors;
  touched: { [key: string]: boolean };
  handleChange: (field: keyof T) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleBlur: (field: keyof T) => () => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  validateField: (field: keyof T) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
  resetForm: () => void;
  isValid: boolean;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationSchema: Yup.ObjectSchema<any>
): UseFormValidationReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleChange = useCallback(
    (field: keyof T) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValues((prev) => ({
          ...prev,
          [field]: e.target.value,
        }));
      },
    []
  );

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));
      validateField(field);
    },
    [values]
  );

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  const validateField = useCallback(
    async (field: keyof T): Promise<boolean> => {
      try {
        await validationSchema.validateAt(field as string, values);
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
        return true;
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          setErrors((prev) => ({
            ...prev,
            [field]: error.message,
          }));
        }
        return false;
      }
    },
    [values, validationSchema]
  );

  const validateForm = useCallback(async (): Promise<boolean> => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors: ValidationErrors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        setErrors(validationErrors);
      }
      return false;
    }
  }, [values, validationSchema]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    validateField,
    validateForm,
    resetForm,
    isValid,
  };
}
