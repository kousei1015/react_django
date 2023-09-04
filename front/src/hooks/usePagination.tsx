import React from "react";

const usePagination = (pagesArray: number[], page: number) => {
  const pagesFunc = () => {
    const leftDots = "....";
    const rightDots = "...";
    if (pagesArray.length <= 5) {
      return pagesArray;
    }

    if (page >= 1 && page <= 3) {
      const firstPageArrays = [1, 2, 3, 4, rightDots, pagesArray.length];
      return firstPageArrays;
    } else if (page >= pagesArray.length - 1) {
      const lastPageArrays = [
        1,
        leftDots,
        pagesArray.length - 2,
        pagesArray.length - 1,
        pagesArray.length,
      ];
      return lastPageArrays;
    } else {
      const slicedArrays = pagesArray.slice(page - 2, page + 1);
      const middlePageArrays = [
        1,
        leftDots,
        ...slicedArrays,
        rightDots,
        pagesArray.length,
      ];
      return middlePageArrays;
    }
  };
  return { pagesFunc } as const;
};

export default usePagination;
