import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import classNames from 'classnames';

const LoginPage = () => {
  const [errorState, setErrorState] = useState(true);
  const navigate = useNavigate();

  const handleError = () => {
    if (errorState) {
      return '';
    }
    return (
      <div className="invalid-tooltip" style={{ display: 'block' }}>Неверные имя пользователя или пароль</div>
    );
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: object({
      username: string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      password: string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('api/v1/login', { username: values.username, password: values.password });
        const { token, username } = response.data;
        console.log(response);
        localStorage.setItem('userId', JSON.stringify({ token, username }));
        navigate('/');
      } catch (e) {
        setErrorState(false);
      }
    },
  });

  return (
    <div className="h-100" id="chat">
      <div className="d-flex flex-column h-100">
        <div className="container-fluid h-100">
          <div className="row justify-content-center align-content-center h-100">
            <div className="col-12 col-md-8 col-xxl-6">
              <div className="card shadow-sm">
                <div className="card-body row p-5">
                  <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                    <img src="/pictures/chat_form.svg" className="rounded-circle" alt="Войти" />
                  </div>
                  <form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={formik.handleSubmit}>
                    <h1 className="text-center mb-4">Войти</h1>
                    <div className="form-floating mb-3">
                      <input name="username" autoComplete="username" required placeholder="Ваш ник" id="username" className={classNames('form-control', { 'is-invalid': !errorState })} onChange={formik.handleChange} value={formik.values.username} />
                      <label htmlFor="username">Ваш ник</label>
                    </div>
                    <div className="form-floating mb-4">
                      <input name="password" autoComplete="current-password" required placeholder="Пароль" type="password" id="password" className={classNames('form-control', { 'is-invalid': !errorState })} onChange={formik.handleChange} value={formik.values.password} />
                      <label className="form-label" htmlFor="password">Пароль</label>
                      {handleError()}
                    </div>
                    <button type="submit" className="w-100 mb-3 btn btn-outline-primary">Войти</button>
                  </form>
                </div>
                <div className="card-footer p-4">
                  <div className="text-center">
                    <span>Нет аккаунта? </span>
                    <a href="/signup">Регистрация</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="Toastify" />
    </div>
  );
};

export default LoginPage;
