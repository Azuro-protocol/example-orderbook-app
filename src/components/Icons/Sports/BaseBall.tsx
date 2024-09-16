import React from 'react';
import { getSportIconColor } from '.';

const BaseBall = (props: any) => {
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
        d="M12.8502 1.9932L12.8428 1.24324L11.3429 1.25814L11.3503 2.00811L12.8502 1.9932ZM2.00822 11.3502L1.25826 11.3427L1.24335 12.8427L1.99331 12.8501L2.00822 11.3502ZM21.992 12.65L22.742 12.6575L22.7569 11.1576L22.0069 11.1501L21.992 12.65ZM11.15 22.007L11.1574 22.757L12.6574 22.7421L12.6499 21.9921L11.15 22.007ZM14.2981 13.2374C14.0052 12.9445 13.5304 12.9445 13.2375 13.2374C12.9446 13.5303 12.9446 14.0052 13.2375 14.2981L14.2981 13.2374ZM15.3588 16.4194C15.6517 16.7123 16.1266 16.7123 16.4194 16.4194C16.7123 16.1265 16.7123 15.6516 16.4194 15.3588L15.3588 16.4194ZM8.64125 7.58057C8.34836 7.28768 7.87349 7.28768 7.58059 7.58057C7.2877 7.87347 7.2877 8.34834 7.58059 8.64123L8.64125 7.58057ZM9.70191 10.7626C9.99481 11.0554 10.4697 11.0554 10.7626 10.7626C11.0555 10.4697 11.0555 9.99479 10.7626 9.70189L9.70191 10.7626ZM18.7382 10.7575C18.6377 10.3557 18.2305 10.1114 17.8287 10.2118C17.4269 10.3123 17.1825 10.7195 17.283 11.1213L18.7382 10.7575ZM17.9901 13.9498C18.0906 14.3516 18.4978 14.5959 18.8996 14.4955C19.3015 14.395 19.5458 13.9878 19.4453 13.586L17.9901 13.9498ZM12.8786 6.71721C13.2805 6.81767 13.6877 6.57335 13.7882 6.1715C13.8886 5.76966 13.6443 5.36245 13.2424 5.26199L12.8786 6.71721ZM10.414 4.55489C10.0122 4.45442 9.60497 4.69875 9.50451 5.10059C9.40405 5.50244 9.64837 5.90964 10.0502 6.0101L10.414 4.55489ZM11.1215 17.2828C10.7196 17.1823 10.3124 17.4267 10.212 17.8285C10.1115 18.2303 10.3558 18.6376 10.7577 18.738L11.1215 17.2828ZM13.5861 19.4451C13.9879 19.5456 14.3951 19.3013 14.4956 18.8994C14.5961 18.4976 14.3517 18.0904 13.9499 17.9899L13.5861 19.4451ZM5.26189 13.2425C5.36236 13.6443 5.76956 13.8886 6.1714 13.7882C6.57325 13.6877 6.81757 13.2805 6.71711 12.8787L5.26189 13.2425ZM6.01 10.0502C5.90954 9.6484 5.50234 9.40408 5.10049 9.50454C4.69865 9.605 4.45433 10.0122 4.55479 10.414L6.01 10.0502ZM18.5409 18.5409C14.9285 22.1532 9.07173 22.1532 5.45938 18.5409L4.39872 19.6015C8.59686 23.7997 15.4034 23.7997 19.6015 19.6015L18.5409 18.5409ZM5.45938 18.5409C1.84703 14.9285 1.84703 9.07173 5.45938 5.45938L4.39872 4.39872C0.200588 8.59686 0.200588 15.4034 4.39872 19.6015L5.45938 18.5409ZM5.45938 5.45938C9.07173 1.84703 14.9285 1.84703 18.5409 5.45938L19.6015 4.39872C15.4034 0.200588 8.59686 0.200588 4.39872 4.39872L5.45938 5.45938ZM18.5409 5.45938C22.1532 9.07173 22.1532 14.9285 18.5409 18.5409L19.6015 19.6015C23.7997 15.4034 23.7997 8.59686 19.6015 4.39872L18.5409 5.45938ZM11.3503 2.00811C11.3742 4.40737 10.4713 6.81159 8.64151 8.6414L9.70217 9.70206C11.8285 7.57576 12.8779 4.77884 12.8502 1.9932L11.3503 2.00811ZM8.64151 8.6414C6.8117 10.4712 4.40749 11.374 2.00822 11.3502L1.99331 12.8501C4.77896 12.8778 7.57587 11.8284 9.70217 9.70206L8.64151 8.6414ZM22.0069 11.1501C19.2213 11.1224 16.4243 12.1719 14.298 14.2982L15.3587 15.3588C17.1885 13.529 19.5927 12.6262 21.992 12.65L22.0069 11.1501ZM14.298 14.2982C12.1717 16.4245 11.1223 19.2214 11.15 22.007L12.6499 21.9921C12.6261 19.5929 13.5289 17.1886 15.3587 15.3588L14.298 14.2982ZM13.2375 14.2981L15.3588 16.4194L16.4194 15.3588L14.2981 13.2374L13.2375 14.2981ZM7.58059 8.64123L9.70191 10.7626L10.7626 9.70189L8.64125 7.58057L7.58059 8.64123ZM17.283 11.1213L17.9901 13.9498L19.4453 13.586L18.7382 10.7575L17.283 11.1213ZM13.2424 5.26199L10.414 4.55489L10.0502 6.0101L12.8786 6.71721L13.2424 5.26199ZM10.7577 18.738L13.5861 19.4451L13.9499 17.9899L11.1215 17.2828L10.7577 18.738ZM6.71711 12.8787L6.01 10.0502L4.55479 10.414L5.26189 13.2425L6.71711 12.8787Z"
        fill={getSportIconColor(props?.gradient)}
      />
      {props.children}
    </svg>
  );
};

export default BaseBall;
