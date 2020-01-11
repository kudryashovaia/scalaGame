import React from "react";
import moment, {Moment} from "moment";
import {InlineDatePicker} from "../react-helpers/InlineDatePicker";
import {ComboOneInput} from "../react-helpers/form/ComboOneField";
import {Bind} from "../react-helpers/bind/Bind";


interface Period {
  name: string;
  startTime: moment.Moment;
  endTime: moment.Moment;
}

const periods: Period[] = [
  {
    name: "текущий месяц",
    startTime: moment().startOf("month"),
    endTime: moment().endOf("month")
  },
  {
    name: "предыдущий месяц",
    startTime: moment().subtract(1, "month").startOf("month"),
    endTime: moment().subtract(1, "month").endOf("month")
  },
  {
    name: "за все время",
    startTime: undefined,
    endTime: undefined
  }
];

function areMomentsEqual(m1: moment.Moment, m2: moment.Moment): boolean {
  return (!m1 && !m2) || (m1 && m2 && m1.isSame(m2));
}

interface PeriodSelectorProps {
  bindStartTime: Bind<Moment>;
  bindEndTime: Bind<Moment>;
}

export class PeriodSelector extends React.Component<PeriodSelectorProps> {
  render() {
    let selectedPeriod = periods.find(p =>
      areMomentsEqual(p.startTime, this.props.bindStartTime.getValue()) &&
      areMomentsEqual(p.endTime, this.props.bindEndTime.getValue())
    );
    return (
      <div style={{display: "flex", alignItems: "baseline"}}>
        <div style={{width: "200px"}}>
          <ComboOneInput
            value={selectedPeriod && selectedPeriod.name}
            selectProperties={{
              clearable: false
            }}
            onChange={v => {
              let period = periods.find(p => p.name == v);
              this.props.bindEndTime.setValue(period.endTime);
              this.props.bindStartTime.setValue(period.startTime);
            }}
            placeholder="Выберите период"
            items={periods.map(p => p.name)}
          />
        </div>
        <span style={{marginLeft: "8px"}}> с </span>
        <InlineDatePicker
          selected={this.props.bindStartTime.getValue()}
          onChange={(v) => this.props.bindStartTime.setValue(v)}
        />
        <span> по </span>
        <InlineDatePicker
          selected={this.props.bindEndTime.getValue()}
          onChange={(v) => this.props.bindEndTime.setValue(v)}
        />
      </div>
    );
  }
}
