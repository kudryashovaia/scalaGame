import React from "react";
import $ from "jquery";
import {history} from "./history";

interface RestoreScrollPositionProps {
  storageKey: string;
  children: React.ReactNode;
}

export class RestoreScrollPosition extends React.Component<RestoreScrollPositionProps> {

  private windowScrollListener = () => {
    localStorage["RestoreScrollPosition_" + this.props.storageKey] = $(window).scrollTop();
  };

  componentDidMount(): void {
    let rememberedScroll = localStorage["RestoreScrollPosition_" + this.props.storageKey];
    if (rememberedScroll && history.action === "POP") {
      $(window).scrollTop(Number(rememberedScroll));
    }
    $(window).on("scroll", this.windowScrollListener);
  }

  componentWillUnmount(): void {
    $(window).off("scroll", this.windowScrollListener);
  }

  render() {
    return this.props.children;
  }
}
