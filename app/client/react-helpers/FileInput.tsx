import React from "react";
import $ from "jquery";
import {Button, Sizes} from "react-bootstrap";


interface FileInputProps {
  multiple?: boolean;
  onFileSelect?: (f: File) => void;
  onMultipleFileSelect?: (fs: File[]) => void;
  bsStyle?: string;
  bsSize?: Sizes;
  btnClassName?: string;
  children: React.ReactNode
  name?: string;
  disabled?: boolean;
  accept?: string;
}

export class FileInput extends React.Component<FileInputProps> {

  private inputRef: any = null;

  handleClick() {
    if (this.inputRef) {
      $(this.inputRef).click();
    }
  }

  onInputChange(e: any) {
    if (this.props.multiple) {
      let files = Array.from<File>(e.target.files);
      if (this.inputRef) {
        this.inputRef.value = null;
      }
      this.props.onMultipleFileSelect(files);
    } else {
      let file = e.target.files[0];
      if (this.inputRef) {
        this.inputRef.value = null;
      }
      this.props.onFileSelect(file);
    }
  }

  render() {
    return [
      <Button
        key={2}
        onClick={() => this.handleClick()}
        className={this.props.btnClassName}
        disabled={this.props.disabled}
        bsSize={this.props.bsSize}
        bsStyle={this.props.bsStyle}
      >
        {this.props.children}
      </Button>,
      <input
        key={1}
        ref={i => {this.inputRef = i}}
        type="file"
        multiple={this.props.multiple}
        name={this.props.name || "file"}
        onChange={(e) => this.onInputChange(e)}
        disabled={this.props.disabled}
        accept={this.props.accept}
        style={{visibility: "hidden", position: "absolute"}}
      />
    ];
  }
}
