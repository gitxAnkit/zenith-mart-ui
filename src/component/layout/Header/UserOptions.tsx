import React, { Fragment, useState } from 'react';
import './Header.css';
import { SpeedDial, SpeedDialAction, Backdrop } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../../redux/hooks';
import { useLogout } from '../../../hooks/useAuth';
import type { User } from '../../../types';

interface UserOptionsProps {
  user: User;
}

const UserOptions: React.FC<UserOptionsProps> = ({ user }) => {
  const { cartItems } = useAppSelector((state) => state.cart);
  const logoutMutation = useLogout();

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const options = [
    { icon: <ListAltIcon />, name: 'Orders', func: orders },
    { icon: <PersonIcon />, name: 'Profile', func: account },
    {
      icon: (
        <ShoppingCartIcon
          style={{ color: cartItems.length > 0 ? 'tomato' : 'unset' }}
        />
      ),
      name: `Cart(${cartItems.length})`,
      func: cart,
    },
    { icon: <ExitToAppIcon />, name: 'Logout', func: logoutUser },
  ];

  if (user.role === 'admin') {
    options.unshift({
      icon: <DashboardIcon />,
      name: 'Dashboard',
      func: dashboard,
    });
  }

  function dashboard() { navigate('/admin/dashboard'); }
  function orders() { navigate('/orders'); }
  function account() { navigate('/account'); }
  function cart() { navigate('/cart'); }
  function logoutUser() {
    logoutMutation.mutate(undefined, {
      onSuccess: () => toast.success('Logout Successfully'),
      onError: () => toast.error('Logout failed'),
    });
  }

  return (
    <Fragment>
      <Backdrop open={open} style={{ zIndex: '10' }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{ zIndex: '11' }}
        open={open}
        direction="down"
        className="speedDial"
        icon={
          <img
            className="speedDialIcon"
            src={user.avatar?.url || '/Profile.png'}
            alt="Profile"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={window.innerWidth <= 600}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;
