export type AuthResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    created_at?: string;
  };
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};
