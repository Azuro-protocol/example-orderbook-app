import React from 'react';
import { getSportIconColor } from '.';

const IceHockey = (props: any) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.18412 19.106L2.90526 19.3121H2.90526L2.18412 19.106ZM2.45343 18.1634L1.73228 17.9574H1.73228L2.45343 18.1634ZM7.00013 16L7.32468 15.3239L7.00013 16ZM10.0161 16.7029L10.0188 17.4529L10.0161 16.7029ZM9.45318 21.8472L9.38837 21.1H9.38837L9.45318 21.8472ZM3.94215 21.9312L3.99746 21.1833H3.99745L3.94215 21.9312ZM12.2385 15.1938L11.586 14.824L12.2385 15.1938ZM19.5615 2.27387L20.214 2.64369V2.64369L19.5615 2.27387ZM22.2202 3.77517L22.8739 4.14289L22.2202 3.77517ZM16.7325 7.31026C16.3776 7.09669 15.9168 7.21126 15.7032 7.56616C15.4896 7.92107 15.6042 8.38191 15.9591 8.59549L16.7325 7.31026ZM18.53 10.1426C18.8849 10.3562 19.3457 10.2416 19.5593 9.8867C19.7729 9.5318 19.6583 9.07095 19.3034 8.85738L18.53 10.1426ZM18.3201 4.56051C17.9652 4.34694 17.5044 4.4615 17.2908 4.81641C17.0772 5.17132 17.1918 5.63216 17.5467 5.84574L18.3201 4.56051ZM20.1176 7.39285C20.4725 7.60643 20.9333 7.49186 21.1469 7.13695C21.3605 6.78205 21.2459 6.3212 20.891 6.10762L20.1176 7.39285ZM2.90526 19.3121L3.17457 18.3695L1.73228 17.9574L1.46298 18.9L2.90526 19.3121ZM6.67558 16.6761C7.95691 17.2912 9.12731 17.4561 10.0188 17.4529L10.0135 15.9529C9.31388 15.9554 8.37276 15.8269 7.32468 15.3239L6.67558 16.6761ZM9.38837 21.1C8.42176 21.1839 7.25977 21.25 6.00013 21.25V22.75C7.31102 22.75 8.51703 22.6813 9.51799 22.5944L9.38837 21.1ZM6.00013 21.25C5.2013 21.25 4.54018 21.2234 3.99746 21.1833L3.88685 22.6792C4.47005 22.7223 5.16827 22.75 6.00013 22.75V21.25ZM12.891 15.5636L20.214 2.64369L18.909 1.90404L11.586 14.824L12.891 15.5636ZM20.8897 0.75C20.0698 0.75 19.3133 1.1908 18.909 1.90405L20.214 2.64369C20.3519 2.40038 20.61 2.25 20.8897 2.25V0.75ZM10.0188 17.4529C11.359 17.4482 12.3412 16.5337 12.891 15.5636L11.586 14.824C11.1813 15.5381 10.6092 15.9508 10.0135 15.9529L10.0188 17.4529ZM1.46298 18.9C1.21551 19.7661 1.30186 20.6633 1.72999 21.3828C2.16655 22.1164 2.92734 22.6083 3.88685 22.6792L3.99745 21.1833C3.51725 21.1478 3.20072 20.921 3.01904 20.6157C2.82895 20.2963 2.75613 19.834 2.90526 19.3121L1.46298 18.9ZM20.8897 2.25C21.4837 2.25 21.8578 2.88973 21.5666 3.40745L22.8739 4.14289C23.7276 2.62526 22.6309 0.75 20.8897 0.75V2.25ZM3.17457 18.3695C3.6355 16.7562 5.24568 15.9898 6.67558 16.6761L7.32468 15.3239C4.97526 14.1961 2.42303 15.5398 1.73228 17.9574L3.17457 18.3695ZM14.5006 18.75H19.5006V17.25H14.5006V18.75ZM19.5006 21.25H14.5006V22.75H19.5006V21.25ZM20.7506 20C20.7506 20.6904 20.1909 21.25 19.5006 21.25V22.75C21.0194 22.75 22.2506 21.5188 22.2506 20H20.7506ZM19.5006 18.75C20.1909 18.75 20.7506 19.3096 20.7506 20H22.2506C22.2506 18.4812 21.0194 17.25 19.5006 17.25V18.75ZM14.5006 17.25C14.3637 17.25 14.2287 17.2601 14.0964 17.2796L14.3155 18.7635C14.3755 18.7546 14.4373 18.75 14.5006 18.75V17.25ZM14.0964 17.2796C12.769 17.4756 11.7506 18.6182 11.7506 20H13.2506C13.2506 19.3729 13.7131 18.8524 14.3155 18.7635L14.0964 17.2796ZM21.5666 3.40745L13.5523 17.6538L14.8596 18.3893L22.8739 4.14289L21.5666 3.40745ZM14.5006 21.25C13.9042 21.25 13.4038 20.8317 13.2801 20.2718L11.8154 20.5956C12.0879 21.8278 13.1856 22.75 14.5006 22.75V21.25ZM13.2801 20.2718C13.2609 20.185 13.2506 20.0941 13.2506 20H11.7506C11.7506 20.2037 11.7729 20.4031 11.8154 20.5956L13.2801 20.2718ZM9.51799 22.5944C10.8828 22.4761 12.1079 21.8787 13.0621 20.9795L12.0334 19.8878C11.3044 20.5748 10.3895 21.0132 9.38837 21.1L9.51799 22.5944ZM15.9591 8.59549L18.53 10.1426L19.3034 8.85738L16.7325 7.31026L15.9591 8.59549ZM17.5467 5.84574L20.1176 7.39285L20.891 6.10762L18.3201 4.56051L17.5467 5.84574Z"
        fill={getSportIconColor(props?.gradient)}
      />
      {props.children}
    </svg>
  );
};

export default IceHockey;
