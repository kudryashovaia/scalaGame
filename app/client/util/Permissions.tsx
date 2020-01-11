import _ from "lodash";

export class Permissions {
  static testPath(permissions: string[], path: string): boolean {
    return !!_.find(permissions, p => path.startsWith(p));
  }
  static isAnyPathPermitted(permissions: string[], paths: string[]): boolean {
    return !!_.find(permissions, perm => _.find(paths, p => p.startsWith(perm)));
  }
}
