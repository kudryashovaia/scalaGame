import React from "react";
import _ from "lodash";
import {SortDirectionType} from "react-virtualized";

interface TableSortWrapperProps {
  data: any[];
  children: (args: {
    sortedData: any[],
    setSort: (args: { sortBy: string, sortDirection: SortDirectionType}) => void,
    sortBy?: string,
    sortDirection: SortDirectionType
  }) => React.ReactNode
}

interface TableSortWrapperState {
  sortBy: string;
  sortDirection: SortDirectionType;
}

export class TableSortWrapper extends React.Component<TableSortWrapperProps, TableSortWrapperState> {
  constructor(props: TableSortWrapperProps) {
    super(props);
    this.state = {
      sortBy: null,
      sortDirection: "ASC"
    };
  }

  render() {
    let sortedAsc = _.sortBy(this.props.data, this.state.sortBy);
    let sortedData = this.state.sortDirection == "ASC" ? sortedAsc : _.reverse(sortedAsc);
    return this.props.children({
      sortedData: sortedData,
      sortBy: this.state.sortBy,
      sortDirection: this.state.sortDirection,
      setSort: ({sortBy, sortDirection}) => {
        this.setState({
          sortBy: sortBy,
          sortDirection: sortDirection
        });
      }
    });
  }
}
