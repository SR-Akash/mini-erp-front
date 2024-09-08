import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

type Message = { message?: string };

type Error<T> = AxiosError<T & Message>;
type Response<T> = AxiosResponse<T & Message>;

type Config<P, Res> = {
  url: string;
  method: "get" | "post" | "put" | "delete";
  payload?: P;
  config?: AxiosRequestConfig;
  cb?: (res: Res) => void;
  isToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  isHiddenSuccessToast?: boolean;
};

type PostData<P, Res> = ({
  url,
  method,
  payload,
  config,
  cb,
  isToast,
  successMessage,
  errorMessage,
}: Config<P, Res>) => void;

type UseAxios<P, Res, Err> = {
  res: Res | null;
  postData: PostData<P, Res>;
  loading: boolean;
  setRes: React.Dispatch<React.SetStateAction<Res | null>>;
  error: Error<Err> | null;
};
