// src\api\controllers\AuthenticationController.ts

import { RequestHandler, Request, Response, NextFunction } from "express";
import { AuthenticationRepository } from "~/src/infrastructure/repositories/AuthenticationRepository";
import { Register } from "~/src/application/useCases/authentication/Register";
import { Login } from "~/src/application/useCases/authentication/Login";
import { Refresh } from "~/src/application/useCases/authentication/Refresh";
import { Logout } from "~/src/application/useCases/authentication/Logout";
import { signAccessToken } from "~/src/utils/jwt";
import crypto from "crypto";
import { sendSuccess, sendError } from "~/src/api/helpers/sendResponse";
import { toVolunteerDTO } from "~/src/api/dto";

export class AuthenticationController {
  private readonly repo = new AuthenticationRepository();
  private readonly registerUseCase = new Register(this.repo);
  private readonly loginUseCase = new Login(this.repo);
  private readonly refreshUseCase = new Refresh(this.repo);
  private readonly logoutUseCase = new Logout(this.repo);

  /** POST /auth/register */
  register: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { volunteer_name, volunteer_email, password, role } = req.body;
    if (!volunteer_name || !volunteer_email || !password) {
      sendError(res, "Missing fields", 400);
      return;
    }
    try {
      const registered = await this.registerUseCase.execute({
        volunteer_name,
        volunteer_email,
        password,
        role,
      });
      if (!registered) {
        sendError(res, "User already exists", 409);
        return;
      }
      sendSuccess(res, toVolunteerDTO(registered), 201);
    } catch (err) {
      next(err);
    }
  };

  /** POST /auth/login */
  login: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { volunteer_email, password } = req.body;
    if (!volunteer_email || !password) {
      sendError(res, "Missing credentials", 400);
      return;
    }
    try {
      const user = await this.loginUseCase.execute({
        volunteer_email,
        password,
      });

      if (!user) {
        sendError(res, "Invalid credentials", 401);
        return;
      }

      const expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN ?? "1h";
      const refreshTokenExpiresInDaysStr =
        process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS ?? "7d";
      const refreshTokenExpiresInDays = refreshTokenExpiresInDaysStr
        ? parseInt(refreshTokenExpiresInDaysStr, 10)
        : 7;

      const accessToken = signAccessToken(
        { volunteer_id: user.volunteer_id, role: user.role },
        expiresIn,
      );

      const refreshToken = crypto.randomUUID();
      const expiresAt = new Date(
        Date.now() + refreshTokenExpiresInDays * 86400 * 1000,
      );
      await this.repo.storeRefreshToken({
        volunteer_id: user.volunteer_id,
        refreshToken,
        expiresAt,
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "prod",
        sameSite: "lax",
        expires: expiresAt,
      });

      sendSuccess(res, { accessToken, user: toVolunteerDTO(user) }, 200);
    } catch (err) {
      next(err);
    }
  };

  /** POST /auth/refresh */
  refresh: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      // No cookie: Unauthorized
      sendError(res, "Invalid refresh token", 401);
      return;
    }

    try {
      // Attempt to get the user from the refresh token (could be invalid/expired)
      const user = await this.refreshUseCase.execute(refreshToken);

      if (!user?.volunteer_id) {
        // Invalid/expired/not found in DB
        sendError(res, "Invalid refresh token", 401);
        return;
      }

      // Success: issue new access token
      const expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN ?? "1h";
      const accessToken = signAccessToken(
        { volunteer_id: user.volunteer_id, role: user.role },
        expiresIn,
      );

      sendSuccess(res, { accessToken, user: toVolunteerDTO(user) }, 200);
    } catch (err) {
      // If your use case can throw for verification/DB problems, treat as 401
      sendError(res, "Invalid refresh token", 401);
      next(err); // For logging, but not for client
    }
  };

  /** POST /auth/logout */
  logout: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const refreshToken = req.cookies.refresh_token;
    // ADD THIS LOG
    if (!refreshToken) {
      sendSuccess(res, null, 204);
      return;
    }

    try {
      await this.logoutUseCase.execute(refreshToken);
      res.clearCookie("refresh_token");
      sendSuccess(res, null, 204);
    } catch (err) {
      next(err);
    }
  };
}
