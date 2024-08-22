const logger = (arg) => {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line
    console.log(arg);
  }
  return false;
};

export default logger;
