import React from "react";

interface NonceProps {
  children: (args: {nonce: number, incrementNonce: () => void}) => React.ReactNode
}

interface NonceState {
  nonce: number;
}

export class Nonce extends React.Component<NonceProps, NonceState> {
  constructor(props: NonceProps) {
    super(props);
    this.state = {
      nonce: 0
    };
  }

  render() {
    return this.props.children({
      nonce: this.state.nonce,
      incrementNonce: () => this.setState(prevState => ({nonce: prevState.nonce + 1}))
    });
  }
}
