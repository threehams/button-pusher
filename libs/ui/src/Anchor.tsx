import styled from "@emotion/styled";
import { SpaceProps, space } from "./spaceProps";
import { DisplayProps, display } from "styled-system";

export const Anchor = styled.a<SpaceProps & DisplayProps>`
  ${space}
  ${display}
`;
