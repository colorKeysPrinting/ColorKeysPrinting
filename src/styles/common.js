import styled     from 'styled-components'
import { BLACK }  from './colors'

export const Html = styled.div`
  font-family: 'Century Gothic', CenturyGothic, AppleGothic, sans-serif;
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

export const CardIcon = styled.img`
  height: 30px;
  width: auto;
  margin: 5px auto;
`

export const FooterHeading = styled.div`
  padding-left: 20px;
  display: block;
`

export const SideNavTitle = styled.div`
  background-color: ${BLACK};
  text-align: center;
`

export const SideNavLogo = styled.img`
  margin-top: 15px;
  height: 100px;
  width: auto;
`

export const SideNavBackground = styled.div`
  background-color: ${BLACK};
  height: 100%;
  width: 100%;
`

export const LogoImg = styled.img`
  height: 65px;
`

export const MenuButton = styled.div`
  display: none;
  @media only screen and (max-width: 600px) {
    display: inherit;
  }
`

export const NavButtons = styled.div`
  display: inherit;
  @media only screen and (max-width: 600px) {
    display: none;
  }
`

export const Li = styled.li`
  list-style-type: none;
  margin-left: -40px;
`

export const BodyScroll = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  height: ${props => props.height || ''};
`