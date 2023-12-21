import { Box, Link, useTheme } from "@mui/material";
import { ComponentProps, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCanadianMapleLeaf } from "react-icons/fa";
import usePathname from "../hooks/usePathname";
import i18n, { LANGUAGES } from "../langs";
import { SIDEMENU_LINKS } from "../utils/helper";
import { CustomButton } from "./common";
import { NavLink } from "react-router-dom";

export const AppLogo = ({
  className = "",
}: {
  className?: ComponentProps<"div">["className"];
}) => (
  <Box
    className={`mb-1 inline-block cursor-pointer rounded-lg p-2 md:mb-3 ${className}`}
    sx={{ backgroundColor: "primary.main" }}
  >
    <Link href={"/"}>
      <FaCanadianMapleLeaf
        className="text-[16px] md:text-[24px]"
        color="#fff"
      />
    </Link>
  </Box>
);

const SideMenu = ({
  isShowMenu,
  setIsShowMenu,
}: {
  isShowMenu: boolean;
  setIsShowMenu: (b: boolean) => void;
}) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const {
    palette: { primary },
  } = useTheme();
  const [theme, setTheme] = useState("dark");
  const handleChangeLanugage = () => {
    i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar");
  };
  const changeTheme = (theme: string) => {
    document.querySelector("html")?.setAttribute("data-theme", theme);
  };

  // if (pathname.includes("/login")) {
  //   return (
  //     <div className="fixed flex h-screen w-20 flex-col justify-between bg-background p-4"></div>
  //   );
  // }
  return (
    <>
      {isShowMenu === true && (
        <div
          onClick={() => setIsShowMenu(false)}
          className="fixed left-0 top-0 z-20 h-full w-full bg-black bg-opacity-80"
        ></div>
      )}

      <aside
        className={`h-screen w-72 min-w-[40%] flex-col justify-between border-r-[1px] bg-white p-4 pt-2 md:flex md:min-w-[20%] ${
          isShowMenu ? "fixed top-0 z-40" : "hidden"
        }`}
        aria-label="Sidebar"
      >
        {/* <div className="flex fixed w-20 bg-white h-screen flex-col justify-between p-4 border-r-[1px]"> */}
        <div
          // className=" flex flex-col items-center pt-2"
          className="flex h-full flex-col overflow-y-auto bg-white py-4"
        >
          {/* <AppLogo className="self-start" /> */}
          {/* <span className="mb-6 w-full border-b-[1px] border-gray-200 p-2"></span> */}
          <ul className="space-y-2 font-medium">
            {SIDEMENU_LINKS.map(
              ({ title, url, ActiveIcon, InActiveIcon }, i) => (
                <li key={url + " " + i}>
                  <NavLink
                    to={url}
                    onClick={() => setIsShowMenu(false)}
                    className={`group flex items-center rounded-lg bg-background p-2 text-gray-900 hover:bg-background ${
                      pathname === url
                        ? "!bg-primary text-white hover:bg-blue-100"
                        : "text-black"
                    }`}
                  >
                    {/* <Tooltip title={t(`menu.${title}`)}> */}
                    {/* <div> */}
                    {pathname === url ? (
                      <ActiveIcon
                        className="text-[16px] md:text-[24px]"
                        // color={primary.main}
                      />
                    ) : (
                      <InActiveIcon className="text-[16px] md:text-[20px]" />
                    )}
                    <span className="ms-3">{t(`menu.${title}`)}</span>
                    {/* </div> */}
                    {/* </Tooltip> */}
                  </NavLink>
                </li>
              )
            )}
          </ul>
          <CustomButton
            // leftIcon={<HiOutlineLanguage />}
            onClick={handleChangeLanugage}
            className={`!mt-4 inline-block cursor-pointer rounded-lg bg-background p-3 text-sm font-bold hover:bg-blue-100`}
          >
            {LANGUAGES.find((lang) => lang.code === i18n.language)?.label ||
              LANGUAGES[0].label}
          </CustomButton>
          {/* <CustomButton
            onClick={() => {
              changeTheme(theme);
            }}
            className={`!mt-4 w-fit cursor-pointer rounded-lg bg-background p-3 text-sm font-bold hover:bg-blue-100`}
          >
            <MdDarkMode size="24" />
          </CustomButton> */}
        </div>
      </aside>
    </>
  );
};

export default SideMenu;
