import React from "react";
import {SmartInputProps} from "./SmartInput";
import {SelectOneInput} from "./SelectOneField";
import {SmartField} from "./SmartField";

export class CurrencyInput extends React.Component<SmartInputProps<number>> {

  static decode: { [key: number]: { name: string, icon: string, sym: string, price: number } } = {
    643: { name: "RUB", icon: "fa-rub", sym: "\u20bd", price: 1 },
    840: { name: "USD", icon: "fa-usd", sym: "\u0024", price: 58.37 },
    987: { name: "EUR", icon: "fa-eur", sym: "\u20ac", price: 69.62 }
  };
  static currencyCodes = [643, 840, 987];

  render() {
    let SelectOneInputTyped = SelectOneInput.of<number>();
    return (
      <SelectOneInputTyped
        items={CurrencyInput.currencyCodes}
        itemLabel={c => <i className={"fa fa-fw " + CurrencyInput.decode[c].icon} />}
        {...this.props}
        className="small-buttons"
      />
    );
  }
}

export class CurrencyField extends SmartField<number, {}> {

  renderInput() {
    return (
      <CurrencyInput
        {...this.smartInputProps()}
      />
    );
  }

}
