import * as R from "ramda";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getAllChildrenIds = (component: any): number[] => {
  const res: any[] = [];

  if (component._children && component._children.length > 0) {
    for (let i = 0; i < component._children.length; i += 1) {
      res.push(component._nativeTag);
      res.push(getAllChildrenIds(component._children[i]));
    }
  } else {
    return component._nativeTag;
  }

  return R.flatten(res);
};

export default getAllChildrenIds;
