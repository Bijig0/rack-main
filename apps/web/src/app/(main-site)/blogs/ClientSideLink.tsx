"use client";

type Props = {
  children: React.ReactNode;
  href: string;
  className?: string;
};

const ClientSideLink = (props: Props) => {
  const { children, href, className } = props;
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
};

export default ClientSideLink;
