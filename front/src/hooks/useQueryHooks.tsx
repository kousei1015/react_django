import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPost,
  fetchComments,
  fetchMyProfile,
  addComment,
  deletePost,
  deleteComment,
  fetchPosts,
  fetchProfiles,
  loginUser,
  registerUser,
  addPost,
  updateProfile,
  updatePost,
} from "../api/api";

export const useProfiles = () => {
  return useQuery(["profiles"], fetchProfiles);
};

export const useMyProfile = () => {
  return useQuery(["myProfile"], fetchMyProfile);
};

export const usePosts = (id: number, orderType: string) => {
  return useQuery(["posts", id, orderType], ({ signal }) =>
    fetchPosts(id, orderType, signal)
  );
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation(loginUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["myProfile"]);
    },
  });
};

export const useRegister = () => {
  return useMutation(registerUser);
};

export const usePutProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries(["myProfile"]);
      queryClient.invalidateQueries(["profiles"]);
    },
  });
};

export const usePost = (id: number) => {
  return useQuery(["post", id], () => fetchPost(id));
};

export const useComments = () => {
  return useQuery(["comments"], fetchComments);
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation(addComment, {
    onSuccess: () => queryClient.invalidateQueries(["comments"]),
  });
};

export const useAddPost = () => {
  return useMutation(addPost);
};

export const useUpdatePost = () => {
  return useMutation(updatePost);
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id }: { id: number }) => deletePost(id), {
    onSuccess: () => queryClient.invalidateQueries(["post"]),
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id }: { id: number }) => deleteComment(id), {
    onSuccess: () => queryClient.invalidateQueries(["comments"]),
  });
};
