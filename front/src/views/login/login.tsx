import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import Gnome from "../../assets/mascots/gnome-plate.png";
import { LoginForm, type LoginFormData } from "../../components/forms/login";
import { mascots } from "../../constants/login";
import { setEcoGardenClient } from "../../lib/ecoGarden";
import { useAuthStore } from "../../stores/auth";
import { handleLogin } from "../../utils/auth";

import "./login.scss";

export function LoginView() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  // Avoid unnecessary re-renders
  const [chosenMascot] = useState(
    mascots[Math.floor(Math.random() * mascots.length)]
  );

  const { user, setUser, loading } = useAuthStore();

  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handlePasswordVisible = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleForm = async (data: LoginFormData) => {
    const hasEmptyValue = Object.entries(data).some(([, value]) => !value);
    if (hasEmptyValue) {
      alert("Formulário possui valor vazio!");
      return;
    }

    const loginData = await handleLogin(data);

    if (loginData.error) {
      alert(loginData.error.message);
      return;
    }

    const { token, currentUser, expires } = loginData;

    cookies.set("ecogarden-token", token, {
      expires,
    });

    cookies.set("ecogarden-user", JSON.stringify(currentUser), {
      expires,
    });

    setEcoGardenClient(token);

    setUser(currentUser);

    navigate("/dashboard");
  };

  return (
    <section id="login">
      <div id="form-field">
        <div
          id="logo"
          className="d-flex mx-auto align-items-center font-primary fw-bold"
        >
          <img src={Gnome} alt="Gnome with plate" />
          <p>Eco Garden</p>
        </div>
        <LoginForm
          passwordVisible={passwordVisible}
          handlePasswordVisible={handlePasswordVisible}
          handleForm={handleForm}
        />
      </div>

      <div
        id="mascot"
        style={{
          // @ts-expect-error CSS var
          "--mascot-color": chosenMascot.color,
        }}
      >
        <img src={chosenMascot.path} alt={chosenMascot.name} />
      </div>
    </section>
  );
}
