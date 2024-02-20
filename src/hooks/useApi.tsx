import axios, { AxiosError, AxiosHeaders } from "axios";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { hideLoader, showLoader } from "../redux/appSettings";
import { APP_LANG } from "../langs";
import { API_URL } from "../utils/endpoints";
import { useCallback } from "react";
import { logOutAction } from "../redux/user";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type requestProps = {
  url: string;
  headers?: AxiosHeaders | object;
  data?: object;
  params?: object;
  requireAuth?: boolean;
  removeHost?: boolean;
  load?: boolean;
};

export default () => {
  const logedUser = useSelector(
    (state: RootState) => state.user || { token: "" },
    shallowEqual
  );
  const token = logedUser?.token;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onCatchError = (error: AxiosError) => {
    console.log("on chatch error: ", error);
    if (error.response) {
      if (error.response.status === 401) {
        dispatch(logOutAction());
        navigate("/login");
      } else if (error.response.status === 500) {
        toast.error(error.message);
      } else if (error.response.status === 400) {
        toast.error(error.response.data as string);
      }
      // console.log("error.response: ", error.response);
      return error.response;
    } else if (error.request) {
      // console.log('error.request: ', error.request);
    }
    return { error: "Connection Error.", data: "Connection Error." };
  };

  const getDataAndParams = ({ data, params }: any) => ({
    data: JSON.stringify(data),
    params: { lang: APP_LANG(), pageSize: 500, ...params },
  });
  const getDataAndParamsGet = ({ params }: any) => ({
    params: { lang: APP_LANG(), pageSize: 500, ...params },
  });

  const validateUser = () => {
    if (!token) {
      dispatch(logOutAction());
      navigate("/login");
    }
    return false;
  };
  const postWithoutAuth = async ({
    url,
    headers = {},
    data = {},
    params = {},
    removeHost,
    load = true,
  }: requestProps) => {
    // console.group("Call Post Request " + API_URL + url);
    // console.log("Post data ", data);
    // console.log("Post params ", params);
    // console.groupEnd();
    if (load) dispatch(showLoader());
    return await axios({
      url: removeHost ? url : `${API_URL}${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        lang: APP_LANG(),
        "Content-type": "Application/json",
        ...headers,
      },
      method: "POST",
      ...getDataAndParams({ data, params }),
    })
      .then(({ data }) => data)
      .catch(onCatchError)
      .finally(() => load && dispatch(hideLoader()));
  };
  const post = async ({
    url,
    headers = {},
    data = {},
    params = {},
    removeHost,
    load = true,
  }: requestProps) => {
    // console.log({data: data, url, userId: logedUser?.user.id});
    // console.group("Call Post Request " + API_URL + url);
    // console.log("Post data ", data);
    // console.log("Post params ", params);
    // console.log("Post headers ", {
    //   Authorization: `Bearer ${token}`,
    //   lang: APP_LANG(),
    //   "Content-type": "Application/json",
    //   ...headers,
    // });
    // console.groupEnd();

    if (validateUser()) return;
    if (load) dispatch(showLoader());

    return await axios({
      url: removeHost ? url : `${API_URL}${url}`,
      headers: {
        // 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
        lang: APP_LANG(),
        "Content-type": "Application/json",
        ...headers,
      },
      method: "POST",
      ...getDataAndParams({ data, params }),
    })
      .then(({ data }) => data)
      .catch(onCatchError)
      .finally(() => load && dispatch(hideLoader()));
  };
  const put = useCallback(
    async ({
      url,
      headers = {},
      data = {},
      params = {},
      removeHost,
      load = true,
    }: requestProps) => {
      // console.group("Call Put Request " + API_URL + url);
      // console.log("Call Put Request " + API_URL + url);
      // console.log("Put data ", data);
      // console.log("Put params ", params);
      // console.groupEnd();
      if (validateUser()) return;
      if (load) dispatch(showLoader());

      return await axios({
        url: removeHost ? url : `${API_URL}${url}`,
        headers: {
          // 'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
          lang: APP_LANG(),
          "Content-type": "Application/json",
          ...headers,
        },
        method: "PUT",
        ...getDataAndParams({ data, params }),
      })
        .then(({ data }) => data)
        .catch(onCatchError)
        .finally(() => load && dispatch(hideLoader()));
    },
    [APP_LANG()]
  );
  const postFormData = async ({
    url,
    headers = {},
    data = {},
    load = true,
  }: requestProps) => {
    // console.log({data: data, url, userId: logedUser?.user.id});
    // console.log('Call Post form data Request ' + API_URL + url);
    // console.log('Post data ', data);
    // console.log('Post params ', params);
    if (validateUser()) return;
    if (load) dispatch(showLoader());

    return await axios({
      url: `${API_URL}${url}`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
        lang: APP_LANG(),
        ...headers,
      },
      method: "POST",
      data,
    })
      .then(({ data }) => data)
      .catch(onCatchError)
      .finally(() => load && dispatch(hideLoader()));
  };
  const deleteMethod = async ({
    url,
    headers = {},
    data = {},
    params = {},
    load = true,
  }: requestProps) => {
    // console.log('Call Post Request ' + API_URL + url);
    // console.log('Post data ', data);
    // console.log('Post params ', params);
    if (load) dispatch(showLoader());

    return await axios({
      url: `${API_URL}${url}`,
      headers: {
        // 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
        "Content-type": "Application/json",
        lang: APP_LANG(),
        ...headers,
      },
      method: "DELETE",
      ...getDataAndParams({ data, params }),
    })
      .then(({ data }) => data)
      .catch(onCatchError)
      .finally(() => load && dispatch(hideLoader()));
  };

  const get = async ({
    url,
    headers = {},
    data = {},
    params = {},
    removeHost,
    load = true,
  }: requestProps) => {
    // console.log('Call Post Request ' + API_URL + url);
    // console.log('Post data ', data);
    // console.log('Post params ', params);
    if (load) dispatch(showLoader());

    return await axios({
      url: removeHost ? url : `${API_URL}${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        lang: APP_LANG(),
        ...headers,
      },
      ...getDataAndParamsGet({ data, params }),
    })
      .then(({ data }) => data)
      .catch(onCatchError)
      .finally(() => load && dispatch(hideLoader()));
  };

  return { get, post, put, postFormData, deleteMethod, postWithoutAuth };
};
