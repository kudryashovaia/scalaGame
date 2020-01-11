import _ from "lodash";
import {Bind} from "./Bind";

export class Binds {
  static push<T>(bind: Bind<T[]>, element: T) {
    bind.applyChange(value => {
      let updatedValue = _.cloneDeep(value) || [];
      updatedValue.push(element);
      return updatedValue;
    });
  }

  static splice<T>(bind: Bind<T[]>, start: number, deleteCount: number, ...items: T[]) {
    bind.applyChange(value => {
      let updatedValue = _.cloneDeep(value);
      updatedValue.splice(start, deleteCount, ...items);
      return updatedValue;
    });
  }
}
