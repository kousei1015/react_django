import axios from "axios";
import {
  Posts,
  Post,
  Profile,
  Comments,
  AuthData,
  Jwt,
  AddPost,
  AddComment,
  AddProfile,
} from "../types";

export const apiUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : import.meta.env.VITE_API_DEV_URL;

export const loginUser = async (authen: AuthData) => {
  try {
    const res = await axios.post<Jwt>(`${apiUrl}authen/jwt/create/`, authen);
    localStorage.setItem("localJWT", res.data.access);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.message;
    }
    throw error;
  }
};

export const fetchMyProfile = async () => {
  try {
    const res = await axios.get<Profile>(`${apiUrl}api/myprofile/`, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("localJWT")}`,
      },
    });
    return res.data[0];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.message;
    }
    throw error;
  }
};

export const fetchProfiles = async () => {
  const res = await axios.get<Profile>(`${apiUrl}api/profile/`);
  return res.data;
};

export const registerUser = async (auth: AuthData) => {
  try {
    const res = await axios.post(`${apiUrl}api/register/`, auth, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.message;
    }
    throw error;
  }
};

export const updateProfile = async (profile: AddProfile) => {
  try {
    const uploadData = new FormData();
    uploadData.append("nickName", profile.nickName);
    profile.img && uploadData.append("img", profile.img, profile.img.name);
    const res = await axios.put(
      `${apiUrl}api/profile/${profile.id}/`,
      uploadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.message;
    }
  }
};

// 投稿関係
export const fetchPosts = async (
  params: number | string = 1,
  orderType: string,
  signal?: AbortSignal
) => {
  let res = null;
  switch (orderType) {
    case "access":
      res = await axios.get<Posts>(`${apiUrl}api/post/access/?page=${params}`, {
        signal,
      });
      break;
    case "congestion":
      res = await axios.get<Posts>(
        `${apiUrl}api/post/congestion/?page=${params}`,
        { signal }
      );
      break;
    default:
      res = await axios.get<Posts>(`${apiUrl}api/post/?page=${params}`, {
        signal,
      });
      break;
  }
  return res.data;
};

export const fetchPost = async (
  id: number | string,
  signal?: AbortSignal
): Promise<Post> => {
  try {
    const res = await axios.get(`${apiUrl}api/post/${id}`, { signal });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.message;
    }
    throw error;
  }
};

export const addPost = async (newPost: AddPost) => {
  try {
    const uploadData = new FormData();
    uploadData.append("placeName", newPost.placeName);
    uploadData.append("description", newPost.description);
    uploadData.append("accessStars", newPost.accessStars);
    uploadData.append("congestionDegree", newPost.congestionDegree);
    for (var i = 0; i < newPost.tags.length; i++) {
      uploadData.append(`tags[${i}]name`, newPost.tags[i].name);
    }
    newPost.img && uploadData.append("img", newPost.img, newPost.img.name);
    const res = await axios.post(`${apiUrl}api/post/`, uploadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.message;
    }
  }
};

export const updatePost = async (postDetail: AddPost) => {
  try {
    const postUploadData = new FormData();
    postUploadData.append("placeName", postDetail.placeName);
    postUploadData.append("description", postDetail.description);
    postUploadData.append("accessStars", postDetail.accessStars);
    postUploadData.append(
      "congestionDegree",
      postDetail.congestionDegree as string
    );
    for (var i = 0; i < postDetail.tags.length; i++) {
      postUploadData.append(`tags[${i}]name`, postDetail.tags[i].name);
    }
    postDetail.img &&
      postUploadData.append("img", postDetail.img, postDetail.img.name);

    const res = await axios.put(
      `${apiUrl}api/post/${postDetail.id}`,
      postUploadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.message;
    }
  }
};

// コメント関係
export const fetchComments = async (): Promise<Comments> => {
  try {
    const res = await axios.get(`${apiUrl}api/comment/`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.message;
    }
    throw error;
  }
};

export const addComment = async (comment: AddComment) => {
  try {
    const res = await axios.post(`${apiUrl}api/comment/`, comment, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.message;
    }
  }
};

export const deletePost = async (id: number) => {
  try {
    await axios.delete(`${apiUrl}api/post/${id}`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return id;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.message;
    }
  }
};

export const deleteComment = async (id: number) => {
  try {
    await axios.delete(`${apiUrl}api/comment/${id}/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return id;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.message;
    }
  }
};
