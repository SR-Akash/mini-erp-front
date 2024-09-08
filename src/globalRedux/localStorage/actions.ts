import { Dispatch } from "redux";

interface SetDataActionPayload<T> {
  name: string;
  key: string;
  value: T;
}

type SetDataAction<T> = {
  type: string;
  payload: SetDataActionPayload<T>;
};

export const setDataAction =
  <T>(name: string, key: string, value: T) =>
  (dispatch: Dispatch<SetDataAction<T>>) => {
    const payload: SetDataActionPayload<T> = { name, key, value };
    const action: SetDataAction<T> = {
      type: "localStorage/setData",
      payload,
    };
    dispatch(action);
  };
