// src\core\entities\Session.ts

export class Session {
  constructor(
    public token_id: string,
    public volunteer_id: number,
    public issued_at: Date,
    public expires_at: Date,
  ) {}
}
