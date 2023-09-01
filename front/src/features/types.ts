// to upload image file
export type File = Blob & {
  readonly lastModified: number;
  readonly name: string;
};

// for Stars.tsx Component
export type PROPS_STARS = {
  value: number;
  setValue?: React.Dispatch<React.SetStateAction<number>>;
  readOnly: boolean;
  whichStar?: "access" | "congestion";
}

// For reuse of type below
export type PostBase = {
  id: number;
  placeName: string;
  description: string;
  userPost: number;
  accessStars: number;
  congestionDegree: number;
  img: string;
  tags: Tag[];
};

export type Tag = {
  id?: number;
  name: string;
};

/* api.ts, Auth.ts*/
export type AuthData = {
  email: string;
  password: string;
};

// api.ts
export type Posts = {
  total_pages: number;
  results: [PostBase];
};

export type AddPost = {
  id?: number;
  accessStars: string;
  congestionDegree: string;
  placeName: string;
  description: string;
  img: File | null;
  tags: Tag[];
};

export type Profile = {
  id: number;
  nickName: string;
  userProfile: number;
  created_on: string;
  img: string;
}[];

export type Post = PostBase & {
  nickName: string;
  profileImage: string;
};

export type AddProfile = {
  id: number;
  nickName: string;
  img: File | null;
};

export type Jwt = {
  access: string;
  refresh: string;
};

export type Comments = {
  id: number;
  text: string;
  userComment: number;
  post: number;
  nickName: string;
  profileImage: string;
}[];

export type AddComment = {
  text: string;
  post: number;
};

// Post.tsx
export type PROPS_POST = PostBase & {
  tags: Tag[];
  profiles: Profile;
};

/*Navbar.tsx */
export type PROPS_PROFILE = {
  id?: number;
  nickName?: string;
  img?: string | null;
};
