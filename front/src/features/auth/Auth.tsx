import React from "react";
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { Wrapper, Title, Error, Text } from "./AuthStyles";
import { Input } from "../../commonStyles/InputStyles";
import { Button } from "../../commonStyles/ButtonStyles";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthData } from "../types";
import {
  selectOpenSignIn,
  selectOpenSignUp,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
} from "./authSlice";
import { useLogin, useRegister } from "../query/queryHooks";

const modalStyles = {
  overlay: {
    backgroundColor: "#777777",
  },
  content: {
    top: "55%",
    left: "50%",

    width: 290,
    height: 580,
    padding: "20px",

    transform: "translate(-50%, -50%)",
    zIndex: 999,
  },
};

const validationSchema = z.object({
  email: z
    .string()
    .nonempty("Eメールが必要です")
    .email("Eメールの形式が間違ってます"),
  password: z
    .string()
    .nonempty("パスワードは必須です")
    .min(4, "パスワードは6文字以上入力してください"),
});

const Auth: React.FC = () => {
  Modal.setAppElement("#root");
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const openSignIn = useSelector(selectOpenSignIn);
  const openSignUp = useSelector(selectOpenSignUp);
  const dispatch: AppDispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AuthData>({
    mode: "onChange",
    shouldUnregister: false,
    resolver: zodResolver(validationSchema),
  });

  const loginSubmit = async (data: AuthData) => {
    await loginMutation.mutateAsync(data);
    dispatch(resetOpenSignIn());
  };

  const registerSubmit = async (data: AuthData) => {
    await registerMutation.mutateAsync(data);
    await loginMutation.mutateAsync(data);
    dispatch(resetOpenSignUp());
  };

  return (
    <>
      <Modal
        isOpen={openSignUp}
        onRequestClose={() => {
          dispatch(resetOpenSignUp());
        }}
        style={modalStyles}
      >
        <form onSubmit={handleSubmit(registerSubmit)}>
          <Wrapper>
            <Title>Map Collection</Title>
            <br />

            <Text>
              ログイン、新規登録をしなくても「Skip」ボタンを押せば、投稿を見ることは可能です
            </Text>
            <Button
              onClick={async () => {
                await dispatch(resetOpenSignIn());
                await dispatch(resetOpenSignUp());
              }}
            >
              Skip
            </Button>

            <br />

            <Input
              placeholder="Emailを入力してください"
              id="email"
              data-testid="email"
              type="text"
              {...register("email")}
            />
            <br />
            {errors.email && <Error>{errors.email.message}</Error>}

            <Input
              placeholder="パスワードを入力してください"
              id="password"
              data-testid="password"
              type="text"
              {...register("password")}
            />
            {errors.password && <Error>{errors.password.message}</Error>}
            <br />

            <Button
              disabled={!isValid}
              type="submit"
              data-testid="submit-button"
            >
              Register
            </Button>
            <br />
            <Button
              onClick={async () => {
                await dispatch(setOpenSignIn());
                await dispatch(resetOpenSignUp());
              }}
            >
              ログインはこちら
            </Button>
          </Wrapper>
        </form>
      </Modal>

      <Modal
        isOpen={openSignIn}
        onRequestClose={async () => {
          dispatch(resetOpenSignIn());
        }}
        style={modalStyles}
      >
        <form onSubmit={handleSubmit(loginSubmit)}>
          <Wrapper>
            <Title>Map Collection</Title>
            <br />

            <Text>
              ログイン、新規登録をしなくても「Skip」ボタンを押せば、投稿を見ることは可能です
            </Text>
            <Button
              data-testid="access_no_login"
              onClick={async () => {
                await dispatch(resetOpenSignIn());
                await dispatch(resetOpenSignUp());
              }}
            >
              Skip
            </Button>

            <br />

            <Input
              placeholder="Emailを入力してください"
              id="email"
              data-testid="email"
              type="text"
              {...register("email")}
            />
            {errors.email && <Error>{errors.email.message}</Error>}
            <br />

            <Input
              placeholder="パスワードを入力してください"
              id="password"
              data-testid="password"
              type="text"
              {...register("password")}
            />
            {errors.password && <Error>{errors.password.message}</Error>}
            <br />

            <Button
              disabled={!isValid}
              type="submit"
              data-testid="submit-button"
            >
              Login
            </Button>
            <br />
            <Button
              onClick={async () => {
                await dispatch(resetOpenSignIn());
                await dispatch(setOpenSignUp());
              }}
            >
              新規登録はこちら
            </Button>
          </Wrapper>
        </form>
      </Modal>
    </>
  );
};

export default Auth;
