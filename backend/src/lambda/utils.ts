import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";

import { createLogger } from '../utils/logger'
const logger = createLogger('utils');

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const jwtToken = extractJwt(event);
  //TODO implement parsing user ID
  //const userId = parseUserId(jwtToken);
  const userId = "001";
  logger.debug("User ID", userId);
  return userId;
}

/**
 * Get a JWT token from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a JWT token
 * @throws Error if invalid Authorization header.
 */
export function extractJwt(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization;
  logger.debug("Authorization", authorization);

  const authParts = authorization.split(' ');
  logger.debug("Auth parts", authParts);

  if (authParts[0].toLowerCase() !== "bearer") {
    logger.error("Invalid Auth header", authParts);
    throw new Error("Invalid authorization header, missing \'Bearer\'");
  }

  const token = authParts[1];
  logger.debug("JWT Token", token);

  if (!token) {
    logger.error("Null token", token);
    throw new Error("Invalid or missing JWT.");
  }

  return token;
}
