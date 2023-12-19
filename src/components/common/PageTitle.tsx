import React, { ComponentProps, ReactNode } from "react";

interface PageTitleProps {
  title: string;
  children?: ReactNode;
  className?: ComponentProps<"div">["className"];
}

const PageTitle = ({ title, children, className }: PageTitleProps) => {
  return (
    <h4 className={`text-sm text-black md:text-lg ${className}`}>
      {title}
      {children}
    </h4>
  );
};

export default PageTitle;
