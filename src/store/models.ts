export interface AxiosResponseRoot {
  dateTime: string;
  service: {
    api: string;
    controller: string;
  };
}
export interface AxiosRawResponse<P> {
  payload: P;
}
export interface AxiosErrorResponse {
  code?: number;
  data: AxiosRawResponse<{
    message: string | null;
    errors?: string;
    succeeded?: boolean;
  }>;
}

export enum Method {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export enum TAG {
  NOTES = "NOTES",
}
