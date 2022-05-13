/* eslint-disable import/first */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { AppDispatch } from "../../app/store";;
import { PROPS_GET_DETAIL } from "../types";
import Rating from "@mui/material/Rating";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { fetchAsyncGetDetail, selectPostDetail } from "../post/postSlice";


const PostDetail: React.FC<PROPS_GET_DETAIL> = ({}) => {
  const dispatch: AppDispatch = useDispatch();
  const postDetail = useSelector(selectPostDetail);
  const { id }: any = useParams();

  useEffect(() => {
    if (id) {
      dispatch(fetchAsyncGetDetail(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <div>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="140"
          image={postDetail.img}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {postDetail.placeName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {postDetail.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <p>アクセス度</p>
            <Rating
             name="read-only" 
             value={postDetail.access_stars} 
             readOnly />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <p>混雑度</p>
            <Rating
              name="read-only"
              value={postDetail.congestion_degree}
              readOnly
            />
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetail;
