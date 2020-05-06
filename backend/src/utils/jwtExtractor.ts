import { APIGatewayProxyEvent } from "aws-lambda";
import { createLogger } from '../utils/logger'

const logger = createLogger('extractJwt');

export function extractJwt(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization;
  logger.info("Authorization", authorization);

  const authParts = authorization.split(' ');
  logger.info("Auth parts", authParts);

  if (authParts[0].toLowerCase() !== "bearer") {
    logger.error("Invalid Auth header", authParts);
    throw new Error("Invalid authorization header, missing \'Bearer\'");
  }

  const token = authParts[1];
  logger.info("JWT Token", token);

  if (!token) {
    logger.error("Null token", token);
    throw new Error("Invalid or missing JWT.");
  }

  return token;
}
