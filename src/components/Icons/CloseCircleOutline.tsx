import * as React from 'react';
import { SVGProps } from 'react';
const CircleOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      d="M11.0052 5.7019C11.2005 5.50664 11.2005 5.19006 11.0052 4.9948C10.8099 4.79953 10.4934 4.79953 10.2981 4.9948L11.0052 5.7019ZM4.9948 10.2981C4.79953 10.4934 4.79953 10.8099 4.9948 11.0052C5.19006 11.2005 5.50664 11.2005 5.7019 11.0052L4.9948 10.2981ZM10.2981 11.0052C10.4934 11.2005 10.8099 11.2005 11.0052 11.0052C11.2005 10.8099 11.2005 10.4934 11.0052 10.2981L10.2981 11.0052ZM5.7019 4.9948C5.50664 4.79953 5.19006 4.79953 4.9948 4.9948C4.79953 5.19006 4.79953 5.50664 4.9948 5.7019L5.7019 4.9948ZM15 8C15 11.866 11.866 15 8 15V16C12.4183 16 16 12.4183 16 8H15ZM8 15C4.13401 15 1 11.866 1 8H0C0 12.4183 3.58172 16 8 16V15ZM1 8C1 4.13401 4.13401 1 8 1V0C3.58172 0 0 3.58172 0 8H1ZM8 1C11.866 1 15 4.13401 15 8H16C16 3.58172 12.4183 0 8 0V1ZM10.2981 4.9948L7.64645 7.64645L8.35355 8.35355L11.0052 5.7019L10.2981 4.9948ZM7.64645 7.64645L4.9948 10.2981L5.7019 11.0052L8.35355 8.35355L7.64645 7.64645ZM11.0052 10.2981L8.35355 7.64645L7.64645 8.35355L10.2981 11.0052L11.0052 10.2981ZM8.35355 7.64645L5.7019 4.9948L4.9948 5.7019L7.64645 8.35355L8.35355 7.64645Z"
      fill="currentColor"
    />
  </svg>
);
export default CircleOutline;
