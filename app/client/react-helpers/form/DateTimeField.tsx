import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

import {SmartInput} from "./SmartInput";
import {SmartField} from "./SmartField";

export class DateTimeInput extends SmartInput<number, {}> {
  render() {
    let value = this.getValue();
    return (
      <DatePicker
        selected={value ? moment(value) : undefined}
        onChange={(v: moment.Moment) => {
          this.onChange(v && v.valueOf());
          this.onBlur();
        }}
        dateFormat="DD.MM.YYYY HH:mm"
        showTimeSelect
        timeFormat="HH:mm"
        timeCaption="Время"
        className="form-control"
        placeholderText="Выберите дату"
        isClearable={!this.props.required}
      />
    );
  }
}

export class DateTimeField extends SmartField<number, {}> {

  renderInput(): React.ReactNode {
    return (
      <DateTimeInput
        {...this.smartInputProps()}
      />
    );
  }
}
