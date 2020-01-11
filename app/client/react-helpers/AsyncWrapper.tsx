import React from 'react';
import _ from "lodash";
import Promise from "bluebird";

import {auth} from "../auth";
import {Confirm} from "../util/Confirm";
import {AxiosRequestConfig} from "axios";

export type AsyncWrapperData = {
  [key: string]: {
    url?: string,
    data?: any,
    params?: {[key: string]: any}
  }
};

interface AsyncWrapperProps {
  data: AsyncWrapperData;
  overlay?: () => JSX.Element;
  render: (props: any) => JSX.Element;
  nonce?: number;
  keepResultOnFetch?: boolean;
  onUpdate?: () => void;
}

interface AsyncWrapperState {
  longWaitTimeout?: number,
  error?: boolean,
  longWait: boolean,
  origData?: AsyncWrapperData,
  isBusy: boolean,
  origNonce?: number;
  result: { [key: string]: any }
}

export class AsyncWrapper extends React.Component<AsyncWrapperProps, AsyncWrapperState> {
  constructor(props: AsyncWrapperProps) {
    super(props);
    this.state = {
      longWait: false,
      result: null,
      isBusy: false
    };
  }

  static retryingGet(attempts: number, url: string, config?: AxiosRequestConfig): Promise<any> {
    return Promise.resolve(auth.axios().get(url, config)).catch(error => {
      if (
        error.response &&
        (error.response.status == 502 || error.response.status == 504) &&
        attempts < 4
      ) {
        console.log(`retrying request ${url}, attempt ${attempts + 1}`);
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            AsyncWrapper.retryingGet(attempts + 1, url, config).then(resolve, reject);
          }, 4000)
        });
      } else {
        throw error;
      }
    });
  }

  fetchData(props: AsyncWrapperProps) {
    if (this.state.isBusy) {
      return;
    }
    if (!_.isEqual(this.state.origData, props.data) || !_.isEqual(this.state.origNonce, props.nonce)) {
      let origData = _.cloneDeep(props.data);
      if (this.state.longWaitTimeout) {
        clearTimeout(this.state.longWaitTimeout);
      }
      this.setState(prevState => ({
        origData: origData,
        origNonce: props.nonce,
        result: this.props.keepResultOnFetch ? prevState.result : null,
        longWait: false,
        isBusy: true,
        longWaitTimeout: window.setTimeout(() => {
          this.setState({longWait: true});
        }, 70)
      }));
      Promise.props(
        _.mapValues(
          props.data,
          (r) => {
            if (r && r.url) {
              return AsyncWrapper.retryingGet(0, r.url, r);
            } else if (r && r.data) {
              return new Promise((resolve) => resolve({data: r.data}));
            } else {
              return null;
            }
          }
        )
      ).then((data) => {
        if (_.isEqual(this.state.origData, origData)) {
          if (this.mounted) {
            this.setState(
              {result: _.mapValues(data, "data"), isBusy: false},
              () => {
                this.props.onUpdate && this.props.onUpdate();
                this.fetchData(this.props);
              }
            );
          }
        }
        return null;
      }).catch((error) => {
        Confirm.errorHandler(error);
        this.setState({error: true, isBusy: false});
      });
    }
  }

  componentDidUpdate() {
    this.fetchData(this.props);
  }

  private mounted: boolean = false;
  componentDidMount() {
    this.mounted = true;
    this.fetchData(this.props);
  }
  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.state.longWaitTimeout);
  }

  render() {
    if (this.state.result === null) {
      if (!this.state.longWait) {
        return null;
      } else {
        if (this.props.overlay) {
          return <this.props.overlay />;
        } else {
          if (this.state.error) {
            return (
              <div style={{textAlign: "center", padding: "40px", color: "red"}}>
                <i className="fa fa-cog fa-spin fa-3x" />
              </div>
            );
          } else {
            return (
              <div style={{textAlign: "center", padding: "40px"}}>
                <i className="fa fa-cog fa-spin fa-3x" />
              </div>
            );
          }
        }
      }
    } else {
      return this.props.render(this.state.result);
    }
  }
}
