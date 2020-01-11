import React from 'react';
import $ from "jquery";

interface WindowSizerProps {
  children: (props: {width: number, height: number}) => React.ReactNode;
}
interface WindowSizerState {
  width: number;
  height: number;
}
export class WindowSizer extends React.Component<WindowSizerProps, WindowSizerState> {
  windowResizeListener?: () => void = null;
  constructor(props: WindowSizerProps) {
    super(props);
    this.state = {
      width: $(window).width(),
      height: $(window).height()
    };
  }
  componentWillMount() {
    this.windowResizeListener = () => {
      this.setState({
        width: $(window).width(),
        height: $(window).height()
      })
    };
    $(window).resize(this.windowResizeListener);
  }

  componentWillUnmount() {
    if (this.windowResizeListener) {
      $(window).off("resize", this.windowResizeListener);
    }
  }

  render() {
    return this.props.children({width: this.state.width, height: this.state.height});
  }
}
