import { useFormik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import FormikError from "../../common/input/FormikError";
import Loading from "../../common/status/Loading";
import { setLoginAction, setLogoutAction } from "../../redux/auth/actions";
import styles from "./login.module.css";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string().required("Code is required"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
});

const LoginForToken = () => {
  const { profileData } = useSelector((state) => state?.auth, shallowEqual);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    initialValues: { ...initialValues, email: profileData?.loginId },
    onSubmit: (values) => {
      dispatch(setLoginAction({ values, setLoading }));
    },
    validationSchema,
  });
  return (
    <form onSubmit={handleSubmit}>
      {loading && <Loading />}
      <div className={styles?.login}>
        <div className={styles?.box}>
          <div className="row">
            <div className="col-md-12">
              <p className="text-left mb-1">
                Your session has expired. <br /> Please confirm password to continue
              </p>
            </div>
            <div className="col-md-12">
              <p className={styles?.label}>Code</p>
              <input
                value={values?.email}
                onChange={(e) => setFieldValue("email", e.target.value)}
                className={styles?.input}
                disabled={true}
              />
              <FormikError errors={errors} name="email" touched={touched} type="text" autoComplete="off" />
            </div>
            <div className="col-md-12">
              <p className={styles?.label}>Password</p>
              <input
                value={values?.password}
                onChange={(e) => setFieldValue("password", e.target.value)}
                type="password"
                className={styles?.input}
                autoComplete="new-password"
              />
              <FormikError errors={errors} name="password" touched={touched} />
            </div>
            <div className="col-md-12 d-flex">
              <button type="submit" className={`${styles?.loginbtn} mr-2`}>
                Confirm
              </button>
              <button
                onClick={(e) => {
                  history.push("/");
                  dispatch(setLogoutAction());
                }}
                type="button"
                className={styles?.loginbtn}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForToken;
