import React, { Fragment, useRef, useState, useEffect } from 'react';
import './LoginSignUp.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FaceIcon from '@mui/icons-material/Face';
import { useAppSelector } from '../../redux/hooks';
import { useLogin, useRegister } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import Loader from '../layout/Loader/Loader';
import ErrorBoundary from '../../ErrorBoundary';
import Resizer from 'react-image-file-resizer';

const LoginSignUp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useAppSelector((state) => state.user);
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const loginTab = useRef<HTMLFormElement>(null);
  const registerTab = useRef<HTMLFormElement>(null);
  const switcherTab = useRef<HTMLButtonElement>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const { name, email, password } = user;

  const [avatar, setAvatar] = useState('/Profile.png');
  const [avatarPreview, setAvatarPreview] = useState('/Profile.png');

  const redirect = location.search ? `/${location.search.split('=')[1]}` : '/account';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  // Show toast on mutation errors
  useEffect(() => {
    if (loginMutation.error) {
      const err = loginMutation.error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Login failed');
    }
  }, [loginMutation.error]);

  useEffect(() => {
    if (registerMutation.error) {
      const err = registerMutation.error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Registration failed');
    }
  }, [registerMutation.error]);

  const loginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email: loginEmail, password: loginPassword });
  };

  const registerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set('name', name);
    myForm.set('email', email);
    myForm.set('password', password);
    myForm.set('avatar', avatar);
    registerMutation.mutate(myForm);
  };

  const registerDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'avatar') {
      const file = e.target.files?.[0];
      if (file) {
        Resizer.imageFileResizer(
          file, 300, 300, 'JPEG', 80, 0,
          (uri) => {
            setAvatarPreview(uri as string);
            setAvatar(uri as string);
          },
          'base64'
        );
      }
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const switchTabs = (_e: React.MouseEvent, tab: string) => {
    if (tab === 'login') {
      switcherTab.current?.classList.add('shiftToNeutral');
      switcherTab.current?.classList.remove('shiftToRight');
      registerTab.current?.classList.remove('shiftToNeutralForm');
      loginTab.current?.classList.remove('shiftToLeft');
    }
    if (tab === 'register') {
      switcherTab.current?.classList.add('shiftToRight');
      switcherTab.current?.classList.remove('shiftToNeutral');
      registerTab.current?.classList.add('shiftToNeutralForm');
      loginTab.current?.classList.add('shiftToLeft');
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <Fragment>
      {isLoading ? (
        <Loader />
      ) : (
        <ErrorBoundary>
          <Fragment>
            <div className="LoginSignUpContainer">
              <div className="LoginSignUpBox">
                <div>
                  <div className="login_signUp_toggle">
                    <p onClick={(e) => switchTabs(e, 'login')}>LOGIN</p>
                    <p onClick={(e) => switchTabs(e, 'register')}>REGISTER</p>
                  </div>
                  <button ref={switcherTab}></button>
                </div>
                <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                  <div className="loginEmail">
                    <MailOutlineIcon />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="loginPassword">
                    <LockOpenIcon />
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  <Link to="/password/forgot">Forget Password?</Link>
                  <input type="submit" value="Login" className="loginBtn" />
                </form>
                <form
                  className="signUpForm"
                  ref={registerTab}
                  encType="multipart/form-data"
                  onSubmit={registerSubmit}
                >
                  <div className="signUpName">
                    <FaceIcon />
                    <input
                      type="text"
                      placeholder="Name"
                      required
                      name="name"
                      value={name}
                      onChange={registerDataChange}
                    />
                  </div>
                  <div className="signUpEmail">
                    <MailOutlineIcon />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      name="email"
                      value={email}
                      onChange={registerDataChange}
                    />
                  </div>
                  <div className="signUpPassword">
                    <LockOpenIcon />
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      name="password"
                      value={password}
                      onChange={registerDataChange}
                    />
                  </div>
                  <div id="registerImage">
                    <img src={avatarPreview} alt="Avatar Preview" />
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={registerDataChange}
                    />
                  </div>
                  <input type="submit" value="Register" className="signUpBtn" />
                </form>
              </div>
            </div>
          </Fragment>
        </ErrorBoundary>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
