import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Password } from "primereact/password";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import InputLayout from "./InputLayout";
import { InputOtp } from "primereact/inputotp";
import { MultiSelect } from "primereact/multiselect";
import { number } from "../../utils/regex";

export const CustomInput = ({
  label,
  name,
  data,
  value,
  onChange,
  errorMessage,
  extraClassName,
  required,
  col = 6,
  inputClass,
  disabled = false,
  type = "text",
  placeholder = "",
  ...props
}) => {
  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
    >
      <InputText
        id={name}
        name={name}
        value={value || data?.[name] || ""}
        type={type}
        onChange={(e) =>
          onChange &&
          onChange({ ...e, name: e.target.name, value: e.target.value })
        }
        className={`input w-full mt-2 p-3 border-round-lg border-none bg-light-color ${inputClass ? inputClass : ""
          } ${errorMessage ? "p-invalid" : ""} ${value || data?.[name]}`}
        placeholder={placeholder || `Enter ${label}`}
        disabled={disabled}
        {...props}
      />
    </InputLayout>
  );
};

export const CustomInputTextArea = ({
  label,
  name,
  data,
  value,
  onChange,
  errorMessage,
  extraClassName,
  required,
  col = 6,
  inputClass,
  disabled = false,
  type = "text",
  placeholder = "",
  ...props
}) => {
  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
    >
      <InputTextarea
        id={name}
        name={name}
        value={value || data?.[name] || ""}
        type={type}
        onChange={(e) =>
          onChange &&
          onChange({ ...e, name: e.target.name, value: e.target.value })
        }
        className={`input w-full border-round-lg border-none bg-light-color ${inputClass ? inputClass : ""
          } ${errorMessage ? "p-invalid" : ""} ${value || data?.[name]}`}
        placeholder={placeholder || `Enter ${label}`}
        disabled={disabled}
        {...props}
      />
    </InputLayout>
  );
};

export const CustomInputNumber = ({
  label,
  name,
  data,
  value,
  onChange,
  errorMessage,
  extraClassName,
  required,
  col = 6,
  inputClass,
  disabled = false,
  type = "text",
  placeholder = "",
  useGrouping = false,
  maxLength = 10,
  ...props
}) => {
  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
    >
      <InputNumber
        id={name}
        name={name}
        value={value || data?.[name] || null}
        type={type}
        onChange={(e) =>
          onChange && onChange({ ...e, name: name, value: e.value })
        }
        className={`input w-full border-round-lg border-none  ${inputClass ? inputClass : ""
          } ${errorMessage ? "p-invalid" : ""}`}
        placeholder={placeholder || `Enter ${name}`}
        disabled={disabled}
        useGrouping={useGrouping}
        maxLength={maxLength}
        {...props}
      />
    </InputLayout>
  );
};

export const CustomFileInput = ({
  label,
  name,
  data,
  onChange,
  errorMessage,
  extraClassName,
  required,
  col = 6,
  disabled = false,
  selectedFiles,
  accept,
  ignoreError,
  ignorelabel,
  icon,
}) => {
  return (
    <InputLayout
      col={col}
      label={label}
      ignorelabel={ignorelabel}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
      ignoreError={ignoreError}
    >
      <div className="avatar-img relative">
        <label htmlFor="file-upload" className="flex align-items-center gap-2 cursor-pointer">
          {icon && <span className="text-lg mt-2">{icon}</span>}
          <p className="flex">Choose Icon</p>
        </label>
        <input
          disabled={disabled}
          id="file-upload"
          className="hidden"
          type="file"
          accept={accept || ".jpg,.jpeg,.png"}
          onChange={(e) =>
            onChange?.({
              ...e,
              name: name,
              value: e?.target?.files?.[0],
            })
          }
          onClick={(event) => {
            const files = event.target.files;
            if (files && files.length === 1 && selectedFiles) {
              const lastSelectedFile = selectedFiles[selectedFiles.length - 1];
              if (lastSelectedFile && files[0].name === lastSelectedFile.name) {
                event.target.value = null;
              }
            }
          }}
        />
      </div>
    </InputLayout>
  );
};

export const CustomPassword = ({
  label,
  name = "",
  data,
  value,
  onChange,
  errorMessage,
  extraClassName,
  required,
  col = 12,
  inputClass,
  disabled = false,
  feedback = false,
  placeholder = "",
  ...props
}) => {
  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
    >
      <Password
        id={name}
        name={name}
        value={value || data?.[name] || ""}
        onChange={(e) =>
          onChange &&
          onChange({ ...e, name: e.target.name, value: e.target.value })
        }
        className={`w-full block mt-3 ${inputClass ? inputClass : ""} ${errorMessage ? "p-invalid" : ""
          }`}
        inputClassName="w-full border-round-lg border-none  "
        disabled={disabled}
        feedback={feedback}
        toggleMask
        placeholder={placeholder || `Enter ${label}`}
        {...props}
      />
    </InputLayout>
  );
};

export const CustomDropDown = ({
  label,
  name,
  onChange,
  options,
  data,
  value,
  errorMessage,
  extraClassName,
  dropDownClassName,
  required,
  formArrayName,
  index,
  col = 6,
  optionLabel = "name",
  placeholder = "",
  highlightOnSelect = true,

  ...props
}) => {
  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
    >
      <Dropdown
        id={name}
        name={name}
        options={options}
        value={value || data?.[name]}
        onChange={(e) =>
          onChange &&
          onChange({
            ...e,
            name: e.target.name,
            value: e.value,
            formArrayName,
            index,
          })
        }
        className={`w-full mt-2 p-0 custom-dropdown border-round-lg border-none bg-light-color primary-color ${errorMessage ? "p-invalid" : ""
          } ${dropDownClassName}`}
        optionLabel={optionLabel}
        placeholder={placeholder || `Select ${name}`}
        highlightOnSelect={highlightOnSelect}
        {...props}
      />
    </InputLayout>
  );
};

export const CustomCheckbox = ({
  label,
  name,
  data,
  value,
  onChange,
  errorMessage,
  extraClassName,
  col,
  formArrayName,
  checked,
  index,
  inputClass,
  template,
  ...props
}) => {
  return (
    <InputLayout
      col={col || 6}
      name=""
      extraClassName={extraClassName}
      errorMessage={data?.formErrors?.[name]}
    >
      <Checkbox
        id={name}
        name={name}
        inputId={label}
        checked={checked || value || data?.[name]}
        onChange={(e) =>
          onChange &&
          onChange({
            ...e,
            name: e.target.name,
            value: e.checked,
            formArrayName,
            index,
          })
        }
        className={`checkbox border-none  ${inputClass ? inputClass : ""} ${errorMessage ? "p-invalid" : ""
          }`}
        {...props}
      />

      {label && (
        <label htmlFor={label} className="ml-2 font-medium heading">
          {label}
        </label>
      )}

      {template && <>{template}</>}
    </InputLayout>
  );
};

export const CustomOtpInput = ({
  label,
  name,
  data,
  value,
  onChange,
  errorMessage,
  extraClassName,
  required,
  col = 6,
  inputClass,
  disabled = false,
  type = "text",
  placeholder = "",
  ...props
}) => {
  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
    >
      <InputOtp
        id={name}
        name={name}
        length={6}
        value={value || data?.[name] || ""}
        type={type}
        onChange={(e) => onChange && onChange({ ...e, name, value: e.value })}
        className={`otp-input ${inputClass ? inputClass : ""} ${errorMessage ? "p-invalid" : ""
          } ${value || data?.[name]}`}
        placeholder={placeholder || `Enter ${label}`}
        disabled={disabled}
        {...props}
      />
    </InputLayout>
  );
};

export const CustomMultiSelectDropDown = ({
  label,
  name,
  onChange,
  options,
  data,
  value,
  errorMessage,
  extraClassName,
  dropDownClassName,
  required,
  formArrayName,
  index,
  col = 6,
  optionLabel = "name",
  placeholder = "",
  highlightOnSelect = true,
  panelHeaderTemplate,
  ...props
}) => {
  return (
    <InputLayout
      col={col}
      label={label}
      name={name}
      required={required}
      extraClassName={extraClassName}
      data={data}
      errorMessage={errorMessage}
    >
      <MultiSelect
        id={name}
        name={name}
        options={options}
        value={value || data?.[name]}
        onChange={(e) =>
          onChange &&
          onChange({
            ...e,
            name: e.target.name,
            value: e.value,
            formArrayName,
            index,
          })
        }
        className={`w-full custom-dropdown border-round-lg border-none  primary-color ${errorMessage ? "p-invalid" : ""
          } ${dropDownClassName}`}
        optionLabel={optionLabel}
        panelHeaderTemplate={panelHeaderTemplate}
        placeholder={placeholder || `Select ${name}`}
        highlightOnSelect={highlightOnSelect}
        {...props}
      />
    </InputLayout>
  );
};
