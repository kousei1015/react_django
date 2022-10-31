import React from "react";
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { Wrapper, Title, Circular, Error, Text } from "./AuthStyles";
import Modal from "react-modal";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField, Button, CircularProgress } from "@material-ui/core";

import { fetchAsyncGetPosts, fetchAsyncGetComments } from "../post/postSlice";

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
  fetchAsyncCreateProf,
} from "./authSlice";

const modalStyles = {
  overlay: {
    backgroundColor: "#777777",
  },
  content: {
    top: "55%",
    left: "50%",

    width: 290,
    height: 475,
    padding: "20px",

    transform: "translate(-50%, -50%)",
  },
};

const Auth: React.FC = () => {
  if (process.env.NODE_ENV !== "test") Modal.setAppElement("#root");
  const openSignIn = useSelector(selectOpenSignIn);
  const openSignUp = useSelector(selectOpenSignUp);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const dispatch: AppDispatch = useDispatch();

  return (
    <>
      <Modal
        isOpen={openSignUp}
        onRequestClose={async () => {
          await dispatch(resetOpenSignUp());
        }}
        style={modalStyles}
      >
        <Formik
          initialErrors={{ email: "Eメールが必要です" }}
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            await dispatch(fetchCredStart());
            const resultReg = await dispatch(fetchAsyncRegister(values));

            if (fetchAsyncRegister.fulfilled.match(resultReg)) {
              await dispatch(fetchAsyncLogin(values));
              await dispatch(fetchAsyncCreateProf({ nickName: "User" }));

              await dispatch(fetchAsyncGetProfs());
              await dispatch(fetchAsyncGetPosts());
              await dispatch(fetchAsyncGetComments());
              await dispatch(fetchAsyncGetMyProf());
            }
            await dispatch(fetchCredEnd());
            await dispatch(resetOpenSignUp());
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("Eメールの形式が間違ってます")
              .required("Eメールが必要です"),
            password: Yup.string().required("password is must").min(4),
          })}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <div>
              <form onSubmit={handleSubmit}>
                <Wrapper>
                  <Title>Map Collection</Title>
                  <br />
                  <Circular>{isLoadingAuth && <CircularProgress />}</Circular>
                  <br />

                  <TextField
                    placeholder="Emailを入力してください"
                    id="email"
                    label="email"
                    name="email"
                    type="input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  <br />
                  {touched.email && errors.email ? (
                    <Error>{errors.email}</Error>
                  ) : null}

                  <TextField
                    placeholder="パスワードを入力してください"
                    id="password"
                    label="password"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  {touched.password && errors.password ? (
                    <Error>{errors.password}</Error>
                  ) : null}
                  <br />
                  <br />

                  <Button
                    variant="contained"
                    color="primary"
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
            </div>
          )}
        </Formik>
      </Modal>

      <Modal
        isOpen={openSignIn}
        onRequestClose={async () => {
          await dispatch(resetOpenSignIn());
        }}
        style={modalStyles}
      >
        <Formik
          initialErrors={{ email: "Eメールを入力して下さい" }}
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            await dispatch(fetchCredStart());
            const result = await dispatch(fetchAsyncLogin(values));
            if (fetchAsyncLogin.fulfilled.match(result)) {
              await dispatch(fetchAsyncGetProfs());
              await dispatch(fetchAsyncGetPosts());
              await dispatch(fetchAsyncGetComments());
              await dispatch(fetchAsyncGetMyProf());
            }
            await dispatch(fetchCredEnd());
            await dispatch(resetOpenSignIn());
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("email format is wrong")
              .required("email is must"),
            password: Yup.string().required("password is must").min(4),
          })}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <div>
              <form onSubmit={handleSubmit}>
                <Wrapper>
                  <Title>Map Collection</Title>
                  <br />
                  <Circular>{isLoadingAuth && <CircularProgress />}</Circular>
                  <br />

                  <TextField
                    placeholder="Emailを入力してください"
                    id="email"
                    label="email"
                    name="email"
                    type="input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />

                  {touched.email && errors.email ? (
                    <Error>{errors.email}</Error>
                  ) : null}
                  <br />

                  <TextField
                    placeholder="パスワードを入力してください"
                    id="password"
                    label="password"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  {touched.password && errors.password ? (
                    <Error>{errors.password}</Error>
                  ) : null}
                  <br />
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
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
            </div>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default Auth;