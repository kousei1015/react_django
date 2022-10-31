export type CustomFormData = FormData & {
  append(name: string, value: string | Blob | number, fileName?: string): void;
}


/*export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}*/

export type File = Blob & {
  readonly lastModified: number;
  readonly name: string;
}
/*authSlice.ts*/
export type PROPS_AUTHEN = {
  email: string;
  password: string;
}

export type PROPS_PROFILE = {
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
}



export type PROPS_COMMENT = {
  text: string;
  post: string;
}
/*Post.tsx*/
export type PROPS_POST = {
  postId: string;
  loginId: number;
  userPost: number;
  placeName: string;
  description: string;
  imageUrl: string;
  accessStars: number;
  congestionDegree: number;
}

export type EDIT_CONTENTS = {
  id: string | undefined;
  EditPost: void;
}

export type DETAIL_CONTENT = {
  id: string | undefined;
  placeName: string;
  description: string;
  accessStars: number;
  congestionDegree: number;
  img: File | null;
}



export type ID = {
  id: string;
};