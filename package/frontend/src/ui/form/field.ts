import type { FormikProps } from 'formik';

// ********************************************************************************
// == Util ========================================================================
export const getTextFieldProps = <T extends object>(formik: FormikProps<T>, name: keyof T & string, label: string = '') => ({
 autoComplete: 'on',
 error: Boolean(formik.touched[name]) && Boolean(formik.errors[name]),
 fullWidth: true,
 helperText: formik.touched[name] ? formik.errors[name] as string | undefined : undefined,
 id: name,
 label: label || undefined,
 name,
 onChange: formik.handleChange,
 type: ['password', 'passwordConfirmation'].includes(name) ? 'password' : 'text',
 value: formik.values[name] as string,
});
