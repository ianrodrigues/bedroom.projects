import styled, { css } from 'styled-components';


export const VolumeContainer = styled.button<VolumeContainerProps>((props) => css`
  display: flex;
  align-items: flex-end;
  height: 17px;
  mix-blend-mode: difference;
  cursor: pointer;
  opacity: 0;
  transition: opacity 300ms;

  ${props.visible && css`
    opacity: 1;
  `}
`);

interface VolumeContainerProps {
  visible?: boolean;
}

export const VolumeBar = styled.span<VolumeBarProps>((props) => css`
  height: 100%;
  width: 5px;
  background-color: #fff;
  opacity: .5;

  &:not(:last-child) {
    margin-right: 3px;
  }

  &:nth-child(1) {
    height: calc(100% - 11px);
  }
  &:nth-child(2) {
    height: calc(100% - 8px);
  }
  &:nth-child(3) {
    height: calc(100% - 6px);
  }
  &:nth-child(4) {
    height: calc(100% - 3px);
  }

  &::before {
    content: '';
  }

  ${props.active && css`
    opacity: 1;
  `}
`);

interface VolumeBarProps {
  active?: boolean;
}
