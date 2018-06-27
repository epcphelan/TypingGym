function classes(classesObject) {
  const classNames = Object.keys(classesObject);
  const classesArray = [];
  for (const className of classNames) {
    if (classesObject.hasOwnProperty(className) && classesObject[className]) {
      classesArray.push(className);
    }
  }
  return classesArray.join(' ');
}

export { classes };
