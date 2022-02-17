import React from "react";
import { IonItem, IonInput, IonText, IonLabel } from "@ionic/react";
import "./Input.css";

interface InputProps {
  errors: { [field: string]: string };
  touched: { [field: string]: boolean };
  values: { [field: string]: any };
  handleBlur: (e: any) => void;
  name: string;
  handleChange: (e: React.ChangeEvent<any>) => void;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  label?: string;
  autocapitalize?: string;
  type?: any;
  [x: string]: any;
}

const Input: React.FC<InputProps> = ({
  name,
  handleChange,
  handleBlur,
  errors,
  touched,
  values,
  disabled = false,
  placeholder = "",
  required = false,
  label = "",
  autocapitalize = "sentences",
  type = "text",
  ...props
}) => (
  <>
    <IonItem className={!!errors[name] && touched[name] ? "error" : "noError"}>
      {label && <IonLabel>{`${label}: `}</IonLabel>}
      <IonInput
        name={name}
        placeholder={placeholder}
        onIonChange={(e: any) => {
          handleChange(e);
        }}
        onIonBlur={handleBlur}
        disabled={disabled}
        required={required}
        value={values[name]}
        autocapitalize={autocapitalize}
        type={type}
        {...props}
      ></IonInput>
    </IonItem>
    {!!errors[name] && touched[name] && (
      <IonText color="danger">
        <p className="caption">{errors[name]}</p>
      </IonText>
    )}
  </>
);

export default Input;
