import axios from "axios";
import { ActionFunctionArgs, json } from "react-router-dom";
import { fallibleExtractFromPostData } from "../../common/helpers";
import { ErrorData, isRemoteErrorPayload } from "../Error";

interface TokenRequest {
  grant_type: "authorization_code";
  code: string;
  redirect_uri?: string;
  client_id?: string;
  client_secret?: string;
}

interface Credentials {
  clientId: string;
  clientSecret: string;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export interface TokenData {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  tokenType: string;
  resolvedExpireTime: Date;
}

async function handleRequest(
  url: string,
  request: TokenRequest,
  credentials: Credentials,
  useBodyCredentials: boolean
): Promise<TokenResponse> {
  const response = await axios.postForm<TokenResponse>(url, request, {
    auth: !useBodyCredentials
      ? {
          username: credentials.clientId,
          password: credentials.clientSecret,
        }
      : undefined,
    headers: {
      Accept: "application/json",
    },
  });
  return response.data;
}

async function handleProxyRequest(
  proxyUrl: string,
  tokenUrl: string,
  request: TokenRequest,
  credentials: Credentials,
  useBodyCredentials: boolean
): Promise<TokenResponse> {
  const response = await axios.post<TokenResponse>(proxyUrl, {
    tokenUrl,
    request,
    credentials,
    useBodyCredentials,
  });
  return response.data;
}

export default async function ({
  request,
}: ActionFunctionArgs): Promise<Response> {
  const formData = await request.formData();

  const tokenUrl = fallibleExtractFromPostData(formData, "tokenUrl");
  const creds: Credentials = {
    clientId: fallibleExtractFromPostData(formData, "clientId"),
    clientSecret: fallibleExtractFromPostData(formData, "clientSecret"),
  };
  const useBodyCredentials =
    formData.get("useBodyCredentials")?.toString() === "on";
  const tokenRequest: TokenRequest = {
    grant_type: "authorization_code",
    code: fallibleExtractFromPostData(formData, "code"),
    redirect_uri: formData.get("redirectUri")?.toString(),
    client_id: useBodyCredentials ? creds.clientId : undefined,
    client_secret: useBodyCredentials ? creds.clientSecret : undefined,
  };

  const proxyUrl = formData.get("proxyUrl")?.toString();

  try {
    const data = await (proxyUrl
      ? handleProxyRequest(
          proxyUrl,
          tokenUrl,
          tokenRequest,
          creds,
          useBodyCredentials
        )
      : handleRequest(tokenUrl, tokenRequest, creds, useBodyCredentials));

    return json<TokenData>({
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      refreshToken: data.refresh_token,
      tokenType: data.token_type,
      resolvedExpireTime: new Date(
        new Date().getTime() + data.expires_in * 1000
      ),
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;
      if (isRemoteErrorPayload(data)) {
        throw json<ErrorData>(
          {
            kind: "RemoteError",
            name: data.error,
            description: data.error_description,
            link: data.error_uri,
          },
          error.response ? error.response.status : 408
        );
      }
      throw json<ErrorData>(
        {
          kind: "GenericRemoteError",
          message: error.message,
          response: JSON.stringify(error.response?.data),
        },
        error.response ? error.response.status : 408
      );
    } else {
      throw json<ErrorData>({ kind: "UnknownError" }, 500);
    }
  }
}
