import React from "react";

let functionCache = new Map<string, Map<React.Component<any>, any>>();

export function memoizeArrow<T>(component: React.Component<any>, fn: (arg: T) => void): (arg: T) => void {
  let functionSource = fn.toString();
  let componentCache = functionCache.get(functionSource);
  if (componentCache) {
    let cachedFn = componentCache.get(component);
    if (cachedFn) {
      return cachedFn;
    } else {
      componentCache.set(component, fn);
      return fn;
    }
  } else {
    let newComponentCache = new Map<React.Component<any>, any>();
    newComponentCache.set(component, fn);
    functionCache.set(functionSource, newComponentCache);
    return fn;
  }
}
