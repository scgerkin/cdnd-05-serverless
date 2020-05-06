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
  return parseUserId(jwtToken)
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
