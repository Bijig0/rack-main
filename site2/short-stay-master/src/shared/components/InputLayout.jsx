

export default function InputLayout({
  label,
  name,
  required,
  col,
  extraClassName = "",
  errorMessage,
  data,
  children,
  ignoreError,
}) {
  col = parseInt(col);
  if (col > 12) {
    col = 12;
  }
  return (
    <div className={`input-layout mb-3 md:mb-0 col-12 md:col-${col} ${extraClassName}`}>
      <label htmlFor={name} className="text-base text-dark font-medium">
        <div className="mb-1">
          {label}
          {required ? <span className="text-red-500">*</span> : null}
        </div>
      </label>
      {children}
      {!ignoreError && (errorMessage || data?.formErrors?.[name]) ? (
        <small className="p-error">
          {errorMessage || data?.formErrors?.[name]}
        </small>
      ) : null}
    </div>
  );
}
