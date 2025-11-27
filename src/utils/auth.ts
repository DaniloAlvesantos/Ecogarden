import { jwtDecode, type JwtPayload } from "jwt-decode";

import type { SignUpFormData } from "../components/forms/signup";
import { EcoGardenApi } from "../lib/ecoGarden";
import type { User } from "../types/user";

type LoginProps = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

export const handleLogin = async (data: LoginProps) => {
  let error = {
    for: "",
    message: "",
  };

  if (!data.email || !data.password) {
    error = {
      for: "Dados Login",
      message: "Preencha todos os campos",
    };
    return { error };
  }

  try {
    const response = await EcoGardenApi.post<LoginResponse>("/user/login", {
      email: data.email,
      password: data.password,
    });

    if (!response || !response.data) {
      error = {
        for: "Dados Login",
        message: "Erro ao realizar login",
      };
      return { error };
    }

    if (!response.data.token) {
      error = {
        for: "Dados Login",
        message: "Erro ao realizar login",
      };
      return { error };
    }

    const token = response.data.token;

    const decoded: User & JwtPayload = jwtDecode(token);
    const expires = decoded.exp
      ? new Date(decoded.exp * 1000)
      : createAWeekLater();
    delete decoded.iat;
    delete decoded.exp;

    const currentUser: User = {
      id: decoded.sub || decoded.id,
      name: decoded.name,
      email: decoded.email,
      phone: decoded.phone,
    };

    return { token, currentUser, expires };
  } catch (err) {
    error = {
      for: "Process Error",
      message: "Erro ao realizar login",
    };
    console.error(err);
    return { error };
  }
};

export const handleSignUp = async (data: SignUpFormData) => {
  let error = {
    for: "",
    message: "",
  };

  if (!data.name || !data.email || !data.password) {
    error = {
      for: "Dados Cadastro",
      message: "Preencha todos os campos",
    };
    return { error };
  }

  try {
    const response = await EcoGardenApi.post("/user/create", {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
    });

    if (!response || !response.data) {
      error = {
        for: "Dados Cadastro",
        message: "Erro ao realizar cadastro",
      };
      return { error };
    }

    if (!response.data.token) {
      error = {
        for: "Dados Login",
        message: "Erro ao realizar login",
      };
      return { error };
    }

    const token = response.data.token;

    const decoded: User & JwtPayload = jwtDecode(token);
    const expires = decoded.exp
      ? new Date(decoded.exp * 1000)
      : createAWeekLater();
    delete decoded.iat;
    delete decoded.exp;

    const currentUser: User = {
      id: decoded.sub || decoded.id,
      name: decoded.name,
      email: decoded.email,
      phone: decoded.phone,
    };

    return { token, currentUser, expires };
  } catch (err) {
    error = {
      for: "Process Error",
      message: "Erro ao realizar login",
    };
    console.error(err);
    return { error };
  }
};

const createAWeekLater = () => {
  const today = new Date();
  const aWeekLater = new Date(today);
  aWeekLater.setDate(today.getDate() + 7);
  return aWeekLater;
};
