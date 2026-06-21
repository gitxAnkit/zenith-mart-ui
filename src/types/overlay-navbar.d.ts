declare module 'overlay-navbar' {
  import * as React from 'react';

  export interface ReactNavbarProps {
    burgerColorHover?: string;
    logo?: string;
    logoWidth?: string;
    navColor1?: string;
    logoHoverSize?: string;
    logoHoverColor?: string;
    link1Text?: string;
    link2Text?: string;
    link3Text?: string;
    link4Text?: string;
    link1Url?: string;
    link2Url?: string;
    link3Url?: string;
    link4Url?: string;
    link1Size?: string;
    link1Color?: string;
    nav1justifyContent?: string;
    nav2justifyContent?: string;
    nav3justifyContent?: string;
    nav4justifyContent?: string;
    link1ColorHover?: string;
    link1Margin?: string;
    searchIcon?: boolean;
    SearchIconElement?: React.ComponentType<any>;
    searchIconColor?: string;
    searchIconColorHover?: string;
    searchIconSize?: string;
    searchIconMargin?: string;
    cartIcon?: boolean;
    CartIconElement?: React.ComponentType<any>;
    cartIconColor?: string;
    cartIconColorHover?: string;
    cartIconSize?: string;
    cartIconMargin?: string;
    profileIcon?: boolean;
    ProfileIconElement?: React.ComponentType<any>;
    profileIconColor?: string;
    profileIconColorHover?: string;
    profileIconSize?: string;
    profileIconMargin?: string;
    profileIconUrl?: string;
    [key: string]: any;
  }

  export class ReactNavbar extends React.Component<ReactNavbarProps> {}
}
