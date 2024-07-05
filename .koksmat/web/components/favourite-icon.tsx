"use client";
export function FavouriteIcon(props: {
  onClick: () => void;
  selected: boolean;
  className: string;
}) {
  return (
    <svg
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick();
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={props.selected ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
