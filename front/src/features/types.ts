/*to upload image file*/
export type File = Blob & {
  readonly lastModified: number;
  readonly name: string;
}


/*authSlice.ts*/
export type PROPS_AUTHEN = {
  email: string;
  password: string;
}

export type PROPS_NEWPROFILE = {
  id: number;
  nickName: string;
  img: File | null;
}

export type PROPS_NICKNAME = {
  nickName: string;
}

/*postSlice.ts*/
export type PROPS_NEWPOST = {
  accessStars: number | null;
  congestionDegree: number | null;
  placeName: string;
  description: string;
  img: File | null;
  tags:{name: string}[];
}

export type DETAIL_CONTENT = {
  id: number;
  placeName: string;
  description: string;
  accessStars: number;
  congestionDegree: number;
  img: File | null;
  tags: {name: string}[];
}

export type CustomFormData = FormData & {
  append(name: string, value: string | Blob | number, fileName?: string): void;
}

/*Post.tsx*/
export type PROPS_POST = {
  postId: number;
  loginId: number;
  userPost: number;
  placeName: string;
  description: string;
  imageUrl: string;
  accessStars: number;
  congestionDegree: number;
  tags: { id: number; name: string }[];
}

/*Navbar.tsx */
export type PROPS_PROFILE = {
  id: number;
  nickName: string;
  img: string;
}

/*PostDetail.tsx */
export type PROPS_COMMENT = {
  text: string;
  post: number;
}

export type TAG ={
  name: string;
}
