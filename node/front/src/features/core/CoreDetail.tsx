import React from 'react'
import PostDetail from '../post/PostDetail'
import { fetchAsyncGetDetail } from '../post/postSlice';
import { selectPostDetail } from '../post/postSlice';
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from "../../app/store";


const CoreDetail: React.FC = () => {


  const dispatch: AppDispatch = useDispatch();
  const postDetail = useSelector(selectPostDetail);

  return (
    <div>
      <PostDetail
        placeName={postDetail.placeName}
        description={postDetail.description}
        img={postDetail.img}
        access_stars={postDetail.access_stars}
        congestion_degree={postDetail.congestion_degree}
      />
    </div>
  )
}

export default CoreDetail
