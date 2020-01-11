import React from "react";
import {SelectOneInput} from "./SelectOneField";
import {SmartInput} from "./SmartInput";
import {SmartField, SmartFieldProps} from "./SmartField";
import {memoizeArrow} from "../memoizeArrow";

interface BooleanSelectInputProps {
  trueLabel?: string;
  falseLabel?: string;
}

export class BooleanSelectInput extends SmartInput<boolean, BooleanSelectInputProps> {
  render(): React.ReactNode {
    let value = this.getValue();
    let trueLabel = this.props.trueLabel || "Есть";
    let falseLabel = this.props.falseLabel || "Нет";
    return (
      <SelectOneInput
        items={[trueLabel, falseLabel]}
        onChange={memoizeArrow<string>(this, v => this.onChange(v === trueLabel))}
        value={value === true ? trueLabel : value === false ? falseLabel : undefined}
        className="small-buttons"
      />
    )
  }
}

export class BooleanSelectField extends SmartField<boolean, BooleanSelectInputProps> {
  renderInput(): React.ReactNode {
    return (
      <BooleanSelectInput
        trueLabel={this.props.trueLabel}
        falseLabel={this.props.falseLabel}
        {...this.smartInputProps()}
      />
    )
  }

  shouldComponentUpdate(nextProps: Readonly<BooleanSelectInputProps & SmartFieldProps<boolean>>): boolean {
    return SmartField.compareProps(this.props, nextProps) ||
      this.props.trueLabel != nextProps.trueLabel ||
      this.props.falseLabel != nextProps.falseLabel;
  }
}
