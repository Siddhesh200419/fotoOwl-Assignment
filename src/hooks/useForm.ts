import { useState, useCallback } from 'react';

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => ValidationErrors<T>
) {
  const [values, setFormValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});

  /**
   * Handle field change and clear the error for that field
   */
  const handleChange = useCallback((name: keyof T, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  }, []);

  /**
   * Reset form values and clear errors
   */
  const resetForm = useCallback(() => {
    setFormValues(initialValues);
    setErrors({});
  }, [initialValues]);

  /**
   * Programmatically update values (useful for editing profile screen)
   */
  const setValues = useCallback((newValues: Partial<T>) => {
    setFormValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  /**
   * Trigger validation and submit the form if valid
   */
  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void | Promise<void>) => {
      return async () => {
        if (validate) {
          const validationErrors = validate(values);
          const hasErrors = Object.values(validationErrors).some(
            (err) => err !== undefined && err !== ''
          );

          if (hasErrors) {
            setErrors(validationErrors);
            return;
          }
        }
        setErrors({});
        await onSubmit(values);
      };
    },
    [values, validate]
  );

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
  };
}
