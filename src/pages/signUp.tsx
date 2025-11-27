import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import Gnome from "../assets/mascots/gnome-plate.png";
import { SignUpForm, type SignUpFormData } from "../components/forms/signup";
import { mascots } from "../constants/login";
import "../views/login/login.scss";
import { setEcoGardenClient } from "../lib/ecoGarden";
import { useAuthStore } from "../stores/auth";
import { handleSignUp } from "../utils/auth";

export function SignUpPage() {
  const [chosenMascot] = useState(
    mascots[Math.floor(Math.random() * mascots.length)]
  );
  const { setUser, user, loading } = useAuthStore();
  const cookies = new Cookies();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleForm = async (data: SignUpFormData) => {
    const hasEmptyValue = Object.entries(data).some(([, value]) => !value);
    console.log(data);
    if (hasEmptyValue) {
      alert("Formulário possui valor vazio!");
      return;
    }

    const signupData = await handleSignUp(data);

    if (signupData.error) {
      alert(signupData.error.message);
      return;
    }

    const { token, currentUser, expires } = signupData;

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
        <SignUpForm handleForm={handleForm} />
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
