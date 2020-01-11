import React from "react";

// NavDropdown does not hide its dropdown if menu item is not its direct child.
// Also may be related to menu item opening a modal dialog.
// This component works around the problem by providing manual close callback to children.

interface DropdownFixProps {
  render: (props: { isOpen: boolean, toggleOpen: () => void }) => JSX.Element | JSX.Element[]
}

interface DropdownFixState {
  isOpen: boolean;
}

export class DropdownFix extends React.Component<DropdownFixProps, DropdownFixState> {
  constructor(props: DropdownFixProps) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  render() {
    return this.props.render({
      isOpen: this.state.isOpen,
      toggleOpen: () => this.setState((prevState) => ({isOpen: !prevState.isOpen}))
    });
  }
}
