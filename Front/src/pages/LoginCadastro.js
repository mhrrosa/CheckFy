import React, { useEffect } from 'react';
import '../components/styles/Body.css';
import '../components/styles/Button.css';
import '../components/styles/Container.css';
import '../pages/styles/LoginCadastro.css';
import logo from '../img/logo_horizontal.png';
import "https://kit.fontawesome.com/f0606dbd93.js";

const LoginCadastro = () => {
  useEffect(() => {
    const btnSignin = document.querySelector("#signin");
    const btnSignup = document.querySelector("#signup");
    const body = document.querySelector("body");

    const handleSigninClick = () => {
      body.className = "sign-in-js";
    };

    const handleSignupClick = () => {
      body.className = "sign-up-js";
    };

    if (btnSignin) {
      btnSignin.addEventListener("click", handleSigninClick);
    }

    if (btnSignup) {
      btnSignup.addEventListener("click", handleSignupClick);
    }

    // Cleanup function to remove event listeners
    return () => {
      if (btnSignin) {
        btnSignin.removeEventListener("click", handleSigninClick);
      }
      if (btnSignup) {
        btnSignup.removeEventListener("click", handleSignupClick);
      }
    };
  }, []);

  return (
    <div className="container-login">
      <div className="content first-content">
        <div className="first-column">
          <img src={logo} className="logo-login" alt="Logo Checkfy" />
          <h2 className="title title-primary">Bem-vindo de Volta!</h2>
          <p className="description description-primary">Para se manter conectado conosco</p>
          <p className="description description-primary">Por favor faça login com suas informações pessoais</p>
          <button id="signin" className="button button-primary">Fazer login</button>
        </div>
        <div className="second-column">
          <h2 className="title title-second">Criar Conta</h2>
          <p className="description description-second">Insira seus dados pessoais para cadastro</p>
          <form className="form">
            <label className="label-input" htmlFor="">
              <i className="fas fa-user icon-modify"></i>
              <input type="text" placeholder="Nome Completo"></input>
            </label>
            <label className="label-input" htmlFor="">
              <i className="fas fa-briefcase icon-modify"></i>
              <select>
                <option value="" disabled selected>Cargo</option>
                <option value="avalidor">Avaliador</option>
                <option value="auditor">Auditor</option>
                <option value="patrocinador">Patrocinador</option>
                <option value="colaborador">Colaborador</option>
              </select>
            </label>
            <label className="label-input" htmlFor="">
              <i className="far fa-envelope icon-modify"></i>
              <input type="email" placeholder="Email"></input>
            </label>
            <label className="label-input" htmlFor="">
              <i className="fas fa-lock icon-modify"></i>
              <input type="password" placeholder="Senha"></input>
            </label>
            <button className="button button-second">Cadastrar</button>
          </form>
        </div>
      </div>
      <div className="content second-content">
        <div className="first-column">
          <img src={logo} className="logo-login" alt="Logo Checkfy" />
          <h2 className="title title-primary">Olá, seja bem-vindo!</h2>
          <p className="description description-primary">É novo por aqui? Clique no botão abaixo</p>
          <p className="description description-primary">Inicie sua jornada na alta maturidade de processos</p>
          <button id="signup" className="button button-primary">Cadastrar-se</button>
        </div>
        <div className="second-column">
          <h2 className="title title-second">Faça seu login</h2>
          <p className="description description-second">Insira seus dados pessoais</p>
          <form className="form">
            <label className="label-input" htmlFor="">
              <i className="far fa-envelope icon-modify"></i>
              <input type="email" placeholder="Email"></input>
            </label>
            <label className="label-input" htmlFor="">
              <i className="fas fa-lock icon-modify"></i>
              <input type="password" placeholder="Senha"></input>
            </label>
            <a className="password" href="/">Esqueceu sua senha?</a>
            <button className="button button-second">Entrar</button>
          </form> 
        </div>
      </div>
    </div>
  );
}

export default LoginCadastro;