import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../services/Api';
import { UserContext } from '../contexts/UserContext'; // Importe o UserContext
import '../components/styles/Body.css';
import '../components/styles/Button.css';
import '../components/styles/Container.css';
import '../pages/styles/LoginCadastro.css';
import logo from '../img/logo_horizontal.png';
import "https://kit.fontawesome.com/f0606dbd93.js";

const LoginCadastro = () => {
  const navigate = useNavigate();
  const { setUserType } = useContext(UserContext); // Use o contexto para obter `setUserType`
  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    email: '',
    senha: ''
  });

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

    return () => {
      if (btnSignin) {
        btnSignin.removeEventListener("click", handleSigninClick);
      }
      if (btnSignup) {
        btnSignup.removeEventListener("click", handleSignupClick);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      if (response.user_id) {
        setUserType(1); // Atualize o contexto para refletir o usuário logado
        localStorage.setItem('userType', '1'); // Opcionalmente, armazene no localStorage
        navigate('/'); // Redireciona para a página inicial após cadastro bem-sucedido
      }
    } catch (error) {
      console.error('Erro ao registrar o usuário:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({
        email: formData.email,
        senha: formData.senha,
      });

      if (response.user_id) {
        localStorage.setItem('userType', '1');
        setUserType(1); // Atualize o contexto para refletir o usuário logado
        navigate('/'); // Redirecione para a Home
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

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
          <form className="form" onSubmit={handleRegister}>
            <label className="label-input" htmlFor="nome">
              <i className="fas fa-user icon-modify"></i>
              <input
                type="text"
                placeholder="Nome Completo"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
              />
            </label>
            <label className="label-input" htmlFor="cargo">
              <i className="fas fa-briefcase icon-modify"></i>
              <select
                name="cargo"
                value={formData.cargo}
                onChange={handleInputChange}
              >
                <option value="" disabled>Cargo</option>
                <option value="Avaliador">Avaliador</option>
                <option value="Auditor">Auditor</option>
                <option value="Patrocinador">Patrocinador</option>
                <option value="Colaborador">Colaborador</option>
              </select>
            </label>
            <label className="label-input" htmlFor="email">
              <i className="far fa-envelope icon-modify"></i>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </label>
            <label className="label-input" htmlFor="senha">
              <i className="fas fa-lock icon-modify"></i>
              <input
                type="password"
                placeholder="Senha"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
              />
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
          <form className="form" onSubmit={handleLogin}>
            <label className="label-input" htmlFor="email">
              <i className="far fa-envelope icon-modify"></i>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </label>
            <label className="label-input" htmlFor="senha">
              <i className="fas fa-lock icon-modify"></i>
              <input
                type="password"
                placeholder="Senha"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
              />
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