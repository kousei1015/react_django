import React from "react";
import {
  LoadingScreen,
  DotWrapper,
  Dot,
} from "./LoadingStyles";

const Loading = () => {
  return (
    <LoadingScreen>
      <h1>Loading</h1>
      <DotWrapper>
        <Dot delay="0s" />
        <Dot delay=".3s" />
        <Dot delay=".5s" />
      </DotWrapper>
    </LoadingScreen>
  );
};

export default Loading;
