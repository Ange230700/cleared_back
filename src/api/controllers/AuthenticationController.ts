// src\api\controllers\AuthenticationController.ts

import { RequestHandler } from "express";
import { AuthenticationRepository } from "~/src/infrastructure/repositories/AuthenticationRepository";
import { Register } from "~/src/application/useCases/authentication/Register";
import { Login } from "~/src/application/useCases/authentication/Login";
import { Refresh } from "~/src/application/useCases/authentication/Refresh";
import { Logout } from "~/src/application/useCases/authentication/Logout";
import { toJSONSafe } from "~/src/utils/bigint-to-number";
import { signAccessToken } from "~/src/utils/jwt";
import crypto from "crypto";

export class AuthenticationController {
  private readonly repo = new AuthenticationRepository();
  private readonly registerUseCase = new Register(this.repo);
  private readonly loginUseCase = new Login(this.repo);
  private readonly refreshUseCase = new Refresh(this.repo);
  private readonly logoutUseCase = new Logout(this.repo);

  /** POST /auth/register */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register: RequestHandler = async (req, res, next) => {
    const { volunteer_name, volunteer_email, password, role } = req.body;
    if (!volunteer_name || !volunteer_email || !password) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }
    const user = await this.registerUseCase.execute({
      volunteer_name,
      volunteer_email,
      password,
      role,
    });
    res.status(201).json(toJSONSafe(user));
  };

  /** POST /auth/login */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: RequestHandler = async (req, res, next) => {
    const { volunteer_email, password } = req.body;
    if (!volunteer_email || !password) {
      res.status(400).json({ error: "Missing credentials" });
      return;
    }
    const user = await this.loginUseCase.execute({
      volunteer_email,
      password,
    });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
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

    res
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "prod",
        sameSite: "lax",
        expires: expiresAt,
      })
      .json({ accessToken, user: toJSONSafe(user) });
  };

  /** POST /auth/refresh */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refresh: RequestHandler = async (req, res, next) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      res.status(401).json({ error: "Missing refresh token" });
      return;
    }
    const user = await this.refreshUseCase.execute(refreshToken);
    if (!user) {
      res.status(401).json({ error: "Invalid refresh token" });
      return;
    }

    const expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN ?? "1h";

    const accessToken = signAccessToken(
      { volunteer_id: user.volunteer_id, role: user.role },
      expiresIn,
    );

    res.json({ accessToken, user: toJSONSafe(user) });
  };

  /** POST /auth/logout */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logout: RequestHandler = async (req, res, next) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      res.status(204).send();
      return;
    }
    await this.logoutUseCase.execute(refreshToken);
    res.clearCookie("refresh_token").status(204).send();
  };
}
