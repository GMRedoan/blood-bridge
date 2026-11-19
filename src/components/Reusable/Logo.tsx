import Image from "next/image";

const Logo = () => {
  return (
    <div>
      <Image src="/logo.jpg" alt="Logo" width={40} height={30} priority />{" "}
    </div>
  );
};

export default Logo;
