// src\types\ApiResponse.ts

export type ApiResponseSuccess<T = boolean | object | null> = {
  status: "success";
  data: T;
  error: null;
};

export type ApiResponseError = {
  status: "error";
  data: null;
  error: { message: string; [key: string]: unknown };
};

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;
