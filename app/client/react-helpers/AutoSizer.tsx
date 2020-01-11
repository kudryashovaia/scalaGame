import React from 'react';
import $ from "jquery";

interface AutoSizerProps {
  render: (width: number, height: number) => JSX.Element
}
interface AutoSizerState {
  width: number;
  height: number;
  windowResizeListener: () => void;
}
export class AutoSizer extends React.Component<AutoSizerProps, AutoSizerState> {
  intervalHandle?: number;
  mounted: boolean;
  latestRef?: HTMLElement;
  constructor(props: AutoSizerProps) {
    super(props);
    this.intervalHandle = null;
    this.mounted = true;
    this.state = {
      width: 0,
      height: 0,
      windowResizeListener: null
    };
  }
  componentDidMount() {
    let windowResizeListener = () => {
      if (this.latestRef) {
        this.checkResize(this.latestRef);
      }
    };
    $(window).on("resize", windowResizeListener);
    this.setState({ windowResizeListener });
  }
  handleRef(ref: HTMLElement) {
    if (this.mounted) {
      this.latestRef = ref;
      this.checkResize(ref);
      if (this.intervalHandle) {
        clearInterval(this.intervalHandle);
      }
      this.intervalHandle = window.setInterval(() => {
        this.checkResize(ref);
      }, 1000);
    }
  }
  checkResize(ref: HTMLElement) {
    if (ref) {
      let width = $(ref).width();
      let height = $(window).height() - $(ref).offset().top;
      if (this.state.width != width || this.state.height != height) {
        this.setState({
          width: width,
          height: height
        });
      }
    }
  }
  componentWillUnmount() {
    this.mounted = false;
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
    }
    if (this.state.windowResizeListener) {
      $(window).off("resize", this.state.windowResizeListener);
    }
  }
  render() {
    return (
      <div ref={this.handleRef.bind(this)}>
        {this.props.render(this.state.width,this.state.height)}
      </div>
    );
  }
}
