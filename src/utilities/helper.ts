export const compactObject = (obj: any) => {
  let newObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] || obj[key] === false) {
      newObj = { ...newObj, [key]: obj[key] };
    }
  });
  return newObj;
};
