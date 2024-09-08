import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { Error, PostData, Response, UseAxios } from "./useAxiosHook";

const useAxios = <P = any, Res = any, Err = any>(): UseAxios<P, Res, Err> => {
  const [res, setRes] = useState<Res | null>(null);
  const [error, setError] = useState<Error<Err> | null>(null);
  const [loading, setLoading] = useState(false);

  const postData: PostData<P, Res> = ({
    url,
    method,
    payload,
    config,
    cb,
    isToast,
    isHiddenSuccessToast,
    successMessage,
    errorMessage,
  }) => {
    setLoading?.(true);
    axios[method](url, payload, config)
      .then((res: Response<Res>) => {
        setRes(res?.data);
        cb?.(res?.data);
        setLoading?.(false);
        if (isToast && !isHiddenSuccessToast) {
          toast.success(
            res?.data?.message ?? successMessage ?? "Submitted Successfully"
          );
        }
      })
      .catch((err: Error<Err>) => {
        setRes(null);
        setError(err);
        setLoading?.(false);
        if (isToast) {
          toast.warn(
            err?.response?.data?.message ?? errorMessage ?? "Failed, try again"
          );
        }
      });
  };

  return { res, postData, loading, setRes, error };
};

export default useAxios;
