declare module "react-phone-number-input" {
  import * as React from "react";

  export interface PhoneProps {
    placeholder?: string;
    value?: string;
    onChange?: (phone: string) => void;
    country?: string;
  }

  declare class Phone extends React.Component<PhoneProps> {}
  export default Phone;
}
