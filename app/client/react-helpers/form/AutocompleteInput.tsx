import React from "react";
import {FormControl} from "react-bootstrap";

import "./AutocompleteInput.scss";

interface AutocompleteInputProps {
  value: string;
  itemValue: (item: any) => string;
  items: any[];
  onChange: (v: string) => void;
  onSelect: (item: any) => void;
  maxListSize?: number;
}

interface AutocompleteInputState {
  listVisible: boolean;
  listIndex: number;
}

export class AutocompleteInput extends React.Component<AutocompleteInputProps,AutocompleteInputState> {
  constructor(props: AutocompleteInputProps) {
    super(props);
    this.state = {
      listVisible: false,
      listIndex: 0
    };
  }
  getAutocompleteItems(): any[] {
    let autocompleteItems: any[] = [];
    if (this.props.value.length > 1) {
      this.props.items.forEach((item) => {
        if (this.props.itemValue(item).toLowerCase().includes(this.props.value.toLowerCase())) {
          autocompleteItems.push(item);
        }
      });
    }
    autocompleteItems = autocompleteItems.slice(0, this.props.maxListSize || 10);
    return autocompleteItems;
  }
  getListIndex(autocompleteItems: any[]): number {
    return Math.max(0, Math.min(autocompleteItems.length, this.state.listIndex));
  }
  isListVisible(autocompleteItems: any[]): boolean {
    return this.state.listVisible && autocompleteItems.length > 0;
  }
  keyHandler(e: any) {
    let autocompleteItems = this.getAutocompleteItems();
    let listIndex = this.getListIndex(autocompleteItems);
    if (e.which == 13) {
      // Return
      this.selectItem(autocompleteItems[listIndex]);
    } else if (e.which == 38) {
      // Up
      if (this.isListVisible(autocompleteItems)) {
        this.setState({ listIndex: Math.max(0, this.state.listIndex - 1) });
      }
    } else if (e.which == 40) {
      // Down
      if (this.isListVisible(autocompleteItems)) {
        this.setState({ listIndex: Math.min(autocompleteItems.length, this.state.listIndex + 1) });
      }
    }
  }
  selectItem(selectedItem: any) {
    this.props.onChange(this.props.itemValue(selectedItem));
    this.props.onSelect(selectedItem);
    this.setState({
      listVisible: false,
      listIndex: 0
    });
  }
  render() {
    let autocompleteItems = this.getAutocompleteItems();
    let listIndex = this.getListIndex(autocompleteItems);
    return (
      <div className="autocomplete-group" onKeyDown={(e) => this.keyHandler(e)} >
        <FormControl
          type="text"
          value={this.props.value || ""}
          onChange={(e) => this.props.onChange((e.target as HTMLInputElement).value)}
          onFocus={() => this.setState({listVisible: true})}
          onBlur={() => this.setState({listVisible: false})}
        />
        {
          this.isListVisible(autocompleteItems) ?
            <div className="list-group">
              { autocompleteItems.map((item: any, i: number) =>
                <a key={i} className={"list-group-item" + (listIndex == i ? " active" : "")} onMouseDown={() => this.selectItem(item)}>
                  {this.props.itemValue(item)}
                </a>
              ) }
            </div> :
            null
        }
      </div>
    );
  }
}
