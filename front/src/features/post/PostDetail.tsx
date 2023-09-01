import React, { useState } from "react";
import { Avatar } from "../../commonStyles/AvatarStyles";
import { Button } from "../../commonStyles/ButtonStyles";
import NoProfileImg from "./../../images/NoProfileImg.webp";
import { useParams, useNavigate } from "react-router-dom";
import { AiFillStar, AiFillEdit } from "react-icons/ai";
import { BsFillEraserFill } from "react-icons/bs";
import {
  Wrapper,
  Content,
  Header,
  UserName,
  Image,
  StarWrapper,
  Text,
  Place,
  Comments,
  Comment,
  CommentNickName,
  CommentBox,
  UnAuthorizedMessage,
  Input,
  CustomButton,
  ButtonFlex,
  TagUl,
  TagList,
} from "./PostDetailStyles";
import {
  usePost,
  useComments,
  useMyProfile,
  useAddComment,
  useDeletePost,
  useDeleteComment,
} from "../query/queryHooks";
import Loading from "../Loading";

const PostDetail: React.FC = () => {
  const { id } = useParams();
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const stars = [1, 2, 3, 4, 5];

  const { data: postDetail, isLoading: postLoading } = usePost(Number(id));
  const { data: comments, isLoading: commentLoading } = useComments();
  const { data: myProfile } = useMyProfile();

  const addCommentMutation = useAddComment();
  const deletePostMutation = useDeletePost();
  const deleteCommentMutation = useDeleteComment();

  const commentsOnPost = comments?.filter((com) => {
    return com.post === postDetail?.id;
  });

  const handleAddComment = async (
    e: React.MouseEvent<HTMLElement>,
    text: string,
    id: number
  ) => {
    const packet = {
      text,
      post: id,
    };
    e.preventDefault();
    if (postDetail?.id && text) {
      await addCommentMutation.mutateAsync(packet);
    }
    setText("");
  };

  const handleDeletePost = (
    id: number,
    e: React.MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();
    deletePostMutation.mutate({ id });
    setMessage("削除成功");
    pushHome();
  };

  const handleDeleteComment = async (
    id: number,
    e: React.MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();
    await deleteCommentMutation.mutateAsync({ id });
  };

  if (postLoading || commentLoading) {
    return <Loading />;
  }

  if (!postDetail) {
    return null;
  }

  function pushHome() {
    navigate("/");
  }

  function pushEditPage() {
    navigate(`update`);
  }

  return (
    <>
      {/* for test to confirm render myprofile and postDetail data */}
      <span style={{ display: "none" }}>{postDetail.placeName}</span>
      <Wrapper>
        <Content>
          <Header>
            {postDetail.profileImage ? (
              <Avatar src={postDetail.profileImage} alt="プロフィール画像" />
            ) : (
              <Avatar src={NoProfileImg} alt="プロフィール画像" />
            )}
            <UserName>{postDetail.nickName}</UserName>
          </Header>

          <div>
            <Image src={postDetail.img} />
          </div>
          <Place data-testid="place-name">名所:{postDetail.placeName}</Place>
          <Place data-testid="description">説明:{postDetail.description}</Place>

          <Text data-testid="access">アクセス度</Text>
          <StarWrapper>
            {stars.map((value) => {
              return value <= postDetail.accessStars ? (
                <AiFillStar key={value} size={25} fill="#FFCC66" />
              ) : (
                <AiFillStar key={value} size={25} />
              );
            })}
          </StarWrapper>
          <br />
          <Text data-testid="congestion">混雑度</Text>
          <StarWrapper>
            {stars.map((value) => {
              return value <= postDetail.congestionDegree ? (
                <AiFillStar key={value} size={25} fill="#FFCC66" />
              ) : (
                <AiFillStar key={value} size={25} />
              );
            })}
          </StarWrapper>

          <TagUl>
            {postDetail.tags.map((tag, index) => (
              <TagList key={index}>
                <span data-testid="tag-name">{tag.name}</span>
              </TagList>
            ))}
          </TagUl>

          <p>{message}</p>

          {postDetail.userPost === myProfile?.userProfile ? (
            <ButtonFlex>
              <Button
                isSmall={true}
                onClick={(e) => handleDeletePost(postDetail.id, e)}
              >
                <BsFillEraserFill data-testid="delete" fill="white" /> 削除
              </Button>
              <Button isSmall={true} onClick={pushEditPage}>
                <AiFillEdit data-testid="edit" fill="white" /> 編集
              </Button>
            </ButtonFlex>
          ) : (
            <></>
          )}
          <Comments>
            {commentsOnPost?.map((comment) => (
              <Comment key={comment.id}>
                {comment.profileImage ? (
                  <Avatar src={comment.profileImage} />
                ) : (
                  <Avatar src={NoProfileImg} />
                )}

                <p>
                  <CommentNickName>{comment.nickName}</CommentNickName>
                  {comment.text}
                </p>
                {myProfile?.userProfile === comment.userComment ? (
                  <Button
                    isSmall={true}
                    onClick={(e) => handleDeleteComment(comment.id, e)}
                  >
                    コメント削除
                  </Button>
                ) : (
                  <></>
                )}
              </Comment>
            ))}
          </Comments>
        </Content>

        {myProfile?.nickName ? (
          <CommentBox>
            <Input
              type="text"
              placeholder="add a comment"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <CustomButton
              data-testid="post"
              disabled={!text.length || !myProfile}
              type="submit"
              onClick={(e) => handleAddComment(e, text, postDetail.id)}
            >
              Post
            </CustomButton>
          </CommentBox>
        ) : (
          <UnAuthorizedMessage>
            コメントをするにはログインして下さい
          </UnAuthorizedMessage>
        )}
      </Wrapper>
    </>
  );
};

export default PostDetail;
