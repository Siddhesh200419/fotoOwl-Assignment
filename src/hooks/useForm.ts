import { useState, useCallback } from 'react';

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => ValidationErrors<T>
) {
  const [values, setFormValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});

  const handleChange = useCallback((name: keyof T, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const setValues = useCallback((newValues: Partial<T>) => {
    setFormValues((prev) => ({ ...prev, ...newValues }));
  }, []);

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void | Promise<void>) => {
      return async () => {
        if (validate) {
          const validationErrors = validate(values);
          const hasErrors = Object.values(validationErrors).some(Boolean);
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

  return { values, errors, handleChange, handleSubmit, setValues, setErrors };
}
