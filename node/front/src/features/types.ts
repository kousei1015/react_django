import { number } from "yup";

export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}
/*authSlice.ts*/
export interface PROPS_AUTHEN {
  email: string;
  password: string;
}

export interface PROPS_PROFILE {
  id: number;
  nickName: string;
  img: File | null;
}

export interface PROPS_NICKNAME {
  nickName: string;
}

/*postSlice.ts*/
export interface PROPS_NEWPOST {
  placeName: string;
  description: string;
  access_stars: number;
  congestion_degree: number;
  img: File | null;
}

export interface PROPS_COMMENT {
  text: string;
  post: number;
}
/*Post.tsx*/
export interface PROPS_POST {
  postId: number;
  loginId: number;
  userPost: number;
  placeName: string;
  description: string;
  imageUrl: string;
  access_stars: number;
  congestion_degree: number;
}

{/*imgにstring型追加したらエラー消失 */}
export interface PROPS_GET_DETAIL {
  img: File | null | string;
  placeName: string;
  description: string;
  access_stars: number;
  congestion_degree: number;
}