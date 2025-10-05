import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Link,
} from "@nextui-org/react";
import Image from "next/image";
import UserSideMenu from "../layout/header/components/User/UserSideMenu";
import SearchFormContainer from "../layout/header/components/SearchFormContainer";
import Logo from "@/public/logo.png";

export default function NavBar() {



  return (
    <Navbar maxWidth="full">
      <NavbarBrand>
        <Link href="/">
          <h1 className="text-4xl font-extrabold flex flex-row">
            <span>
              <Image
                src={Logo}
                alt="dantotsu"
                width="50"
                className="rounded-full max-w-fit"
              />
            </span>
            an<span className="text-purple-600">kaiser</span>
          </h1>
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        <SearchFormContainer />
        <div className="right-0 flex">
          <UserSideMenu />
        </div>
      </NavbarContent>
    </Navbar>
  );
}
