export const getSkipAndTake = (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  return {
    take: pageSize,
    skip,
  };
};
