declare module "inputmask-core" {
  interface InputMaskOptions {
    pattern: string,
    value?: string
  }
  declare class InputMask {
    constructor(options: InputMaskOptions);
    getRawValue(): string;
    getValue(): string;
  }
  export default InputMask;
}
