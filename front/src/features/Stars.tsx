import React from "react";
import { AiFillStar } from "react-icons/ai";
import { PROPS_STARS } from "./types";

const Stars = ({ value, setValue, readOnly, whichStar }: PROPS_STARS) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <>
      {/* readOnlyがtrueの時はPost.tsxで使う一覧画面用のレビュー。そのため、値を変更するためのsetState関数、onClickイベントは要らない。 */}
      {readOnly
        ? stars.map((star) => {
            return star <= value ? (
              <AiFillStar key={star} size={22} fill="#FFCC66" />
            ) : (
              <AiFillStar key={star} size={22} />
            );
          })
        : // 以下の場合はreadOnlyがfalseの場合。この場合、アクセス度、混雑度を決めるためにsetState関数、onClickといったイベントハンドラを付ける。
          stars.map((star) => {
            return star <= value ? (
              <AiFillStar
                key={star}
                size={25}
                fill="#FFCC66"
                onClick={() => setValue!(star)}
                data-testid={`${star}${whichStar}Stars`}
              />
            ) : (
              <AiFillStar
                key={star}
                size={25}
                onClick={() => setValue!(star)}
                data-testid={`${star}${whichStar}Stars`}
              />
            );
          })}
    </>
  );
};

export default Stars;
