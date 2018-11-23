import styled     from 'styled-components'
import { BLACK }  from './colors'

export const Html = styled.div`
  font-family: 'Century Gothic', CenturyGothic, AppleGothic, sans-serif;
`

export const Hidden = styled.h2`
  margin: 0px;
  overflow: hidden;
  width: 0px;
  height: 0px;
`

export const Header = styled.h5`
  text-decoration: underline;
`

export const CardFont = styled.p`
  font-size: 20px;
`

export const SocialMedia = styled.div`
  display: ${'inline-flex'};
  padding-left: 20px;
`

export const SocialMediaNetworks = styled.div`
  vertical-align: top;
  display: inline-block;
  margin-right: 30px;
  text-align: center;
`

export const SocialMediaBtn = styled.a`
  cursor: pointer;
  margin: 2px;
  &:hover {
    opacity: 0.75;
  }
`

export const SocialMediaCtn = styled.div`
  margin-top: 3px;
  font-size: 12px;
`

export const CardIcon = styled.img`
  height: 30px;
  width: auto;
  margin: 5px auto;
`

export const FooterHeading = styled.div`
  padding-left: 20px;
  display: block;
`

export const NavBar = styled.nav`
  background-color: ${BLACK};
  width: 100%;
  height: 65px;
`

export const NavBarItem = styled.li`
  width: 100px;
  text-align: center;
  color: ${BLACK};
  background-color: ${props => props.color || ''};
`

export const NavBarItemLink = styled.div`
  color: ${BLACK};
  font-weight: bold;
`

export const SideNavItem = styled.div`
  width: 350px;
  text-align: center;
  background-color: ${props => props.color || ''};
`

export const SideNavTitle = styled.div`
  background-color: ${BLACK};
  padding: 0;
`

export const LogoImg = styled.img`
  height: 65px;
`

export const BrandLogo = styled.a`
  height: 65px;
`

export const NavBtn = styled.div``
