import { APIGatewayProxyEvent } from "aws-lambda";

export function extractJwt(event: APIGatewayProxyEvent): String {
  const authorization = event.headers.Authorization;
  const authParts = authorization.split(' ');

  if (authParts[0].toLowerCase() !== "bearer") {
    throw new Error("Invalid authorization header, missing \'Bearer\'");
  }

  const token = authParts[1];

  if (!!token) {
    throw new Error("Invalid or missing JWT.");
  }

  return token;
}
