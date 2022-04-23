import { FindUserById } from "@lib/services/user/FindUserById";
import { Role } from "@utils/user";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export type ApiHandlerUserInfo = {
  userId: string;
  userRole: string;
  isAdmin: boolean;
};

export type ApiHandlerCallback = (
  req: NextApiRequest,
  res: NextApiResponse,
  userInfo: ApiHandlerUserInfo
) => ReturnType<NextApiHandler>;

export const ApiHandler = (callback: ApiHandlerCallback): NextApiHandler => {
  return async (req, res) => {
    const token = await getToken({
      req,
      secret: process.env.JWT_SECRET,
    });

    if (!token || !token.sub) {
      res.status(StatusCodes.UNAUTHORIZED).end(ReasonPhrases.UNAUTHORIZED);
      return;
    }

    const user = await FindUserById(token.sub);

    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).end(ReasonPhrases.UNAUTHORIZED);
      return;
    }

    try {
      return callback(req, res, {
        userId: user.id,
        userRole: user.role,
        isAdmin: user.role === Role.ADMIN,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ReasonPhrases.UNAUTHORIZED) {
          res.status(StatusCodes.UNAUTHORIZED).end(ReasonPhrases.UNAUTHORIZED);
        } else if (error.message === ReasonPhrases.METHOD_NOT_ALLOWED) {
          res
            .status(StatusCodes.METHOD_NOT_ALLOWED)
            .end(ReasonPhrases.METHOD_NOT_ALLOWED);
        } else if (error.message === ReasonPhrases.BAD_REQUEST) {
          res.status(StatusCodes.BAD_REQUEST).end(ReasonPhrases.BAD_REQUEST);
        } else {
          res.status(StatusCodes.BAD_REQUEST).end(ReasonPhrases.BAD_REQUEST);
        }
      } else {
        res.status(500).end();
      }
    }
  };
};
