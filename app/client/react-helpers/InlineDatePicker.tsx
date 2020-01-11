import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "./InlineDatePicker.scss";

moment.locale("ru");

export const InlineDatePicker = (props: {
  selected: moment.Moment,
  onChange: (date: moment.Moment | null) => any
}) => (
  <div className="inline-date-picker">
    <DatePicker
      {...props}
      dateFormat="DD.MM.YYYY"
      className="form-control"
    />
  </div>
);
