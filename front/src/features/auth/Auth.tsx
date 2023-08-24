import React from "react";
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { Wrapper, Title, Error, Text } from "./AuthStyles";
import { Input } from "../../commonStyles/InputStyles";
import { Button } from "../../commonStyles/ButtonStyles";
import {
  LoadingScreen,
  DotWrapper,
  Dot,
} from "../../commonStyles/LoadingStyles";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PROPS_AUTHEN } from "../types";

import { fetchAsyncGetPosts } from "../post/postSlice";

import {
  selectIsLoadingAuth,
  selectOpenSignIn,
  selectOpenSignUp,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncLogin,
  fetchAsyncRegister,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
} from "./authSlice";

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
  },
};

const validationSchema = z.object({
  email: z.string().nonempty("Eメールが必要です").email("Eメールの形式が間違ってます"),
  password: z.string().nonempty("パスワードは必須です").min(4, "パスワードは6文字以上入力してください")
})

const Auth: React.FC = () => {
  Modal.setAppElement("#root");

  const openSignIn = useSelector(selectOpenSignIn);
  const openSignUp = useSelector(selectOpenSignUp);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const dispatch: AppDispatch = useDispatch();

  const {
    register, //フォームから入力された値のstate管理、バリデーション処理が可能
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PROPS_AUTHEN>({
    mode: "onChange",
    shouldUnregister: false,
    resolver: zodResolver(validationSchema),
  });

  const loginSubmit = async (data: PROPS_AUTHEN) => {
    dispatch(fetchCredStart());

    const resultReg = await dispatch(fetchAsyncRegister(data));
    if (fetchAsyncRegister.fulfilled.match(resultReg)) {
      await dispatch(fetchAsyncLogin(data));

      await Promise.all([
        dispatch(fetchAsyncGetProfs()),
        dispatch(fetchAsyncGetPosts(1)),
        dispatch(fetchAsyncGetMyProf()),
      ]);
    }
    dispatch(fetchCredEnd());
    dispatch(resetOpenSignUp());
  };

  const registerSubmit = async (data: PROPS_AUTHEN) => {
    dispatch(fetchCredStart());

    const result = await dispatch(fetchAsyncLogin(data));
    if (fetchAsyncLogin.fulfilled.match(result)) {
      await Promise.all([
        dispatch(fetchAsyncGetProfs()),
        dispatch(fetchAsyncGetPosts(1)),
        dispatch(fetchAsyncGetMyProf()),
      ]);
    }

    dispatch(fetchCredEnd());
    dispatch(resetOpenSignIn());
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
        <form onSubmit={handleSubmit(loginSubmit)}>
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

            {isLoadingAuth && (
              <LoadingScreen>
                <h1>Loading</h1>
                <DotWrapper>
                  <Dot delay="0s" />
                  <Dot delay=".3s" />
                  <Dot delay=".5s" />
                </DotWrapper>
              </LoadingScreen>
            )}

            <br />

            <Input
              placeholder="Emailを入力してください"
              id="email"
              type="text"
              {...register("email")}
            />
            <br />
            {errors.email && <Error>{errors.email.message}</Error>}

            <Input
              placeholder="パスワードを入力してください"
              id="password"
              type="text"
              {...register("password")}
            />
            {errors.password && <Error>{errors.password.message}</Error>}
            <br />
            <br />

            <Button
              disabled={!isValid}
              type="submit"
              data-testid="submit-button"
            >
              Register
            </Button>
            <br />
            <Text
              onClick={async () => {
                await dispatch(setOpenSignIn());
                await dispatch(resetOpenSignUp());
              }}
            >
              ログインはこちら
            </Text>
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
        <form onSubmit={handleSubmit(registerSubmit)}>
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
            {isLoadingAuth && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h1>Loading</h1>
                <DotWrapper>
                  <Dot delay="0s" />
                  <Dot delay=".3s" />
                  <Dot delay=".5s" />
                </DotWrapper>
              </div>
            )}

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
            <br />

            <Button
              disabled={!isValid}
              type="submit"
              data-testid="submit-button"
            >
              Login
            </Button>
            <br />
            <br />
            <Text
              onClick={async () => {
                await dispatch(resetOpenSignIn());
                await dispatch(setOpenSignUp());
              }}
            >
              新規登録はこちら
            </Text>
          </Wrapper>
        </form>
      </Modal>
    </>
  );
};

export default Auth;
