import { Box, Link, Tooltip, useTheme } from "@mui/material";
import { ComponentProps, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCanadianMapleLeaf } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import usePathname from "../hooks/usePathname";
import i18n from "../langs";
import { SIDEMENU_LINKS } from "../utils/helper";
import { CustomButton } from "./common";

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
        className={`fixed md:relative min-h-screen  min-w-[50%] md:min-w-[80px] flex-col justify-between border-r-[1px] bg-white py-2 md:flex ${
          isShowMenu ? "fixed top-0 z-40" : "hidden"
        }`}
        aria-label="Sidebar"
      >
        <div className="absolute top-0 w-full flex h-full flex-col overflow-y-auto bg-white p-4">
          <ul className="space-y-2 font-medium">
            {SIDEMENU_LINKS.map(
              ({ title, url, ActiveIcon, InActiveIcon }, i) => (
                <li key={url + " " + i}>
                  <Tooltip title={t(`menu.${title}`)}>
                    <NavLink
                      to={url}
                      onClick={() => setIsShowMenu(false)}
                      className={`group flex justify-start md:justify-center items-center rounded-lg bg-background p-2 text-gray-900 hover:bg-background ${
                        pathname === url
                          ? "!bg-primary text-white hover:bg-blue-100"
                          : "text-black"
                      }`}
                    >
                      {pathname === url ? (
                        <ActiveIcon className="text-[16px] md:text-[24px]" />
                      ) : (
                        <InActiveIcon className="text-[16px] md:text-[20px]" />
                      )}
                      <span className="ms-3 inline-block md:hidden">
                        {t(`menu.${title}`)}
                      </span>
                    </NavLink>
                  </Tooltip>
                </li>
              )
            )}
          </ul>
          {/* <CustomButton
            onClick={handleChangeLanugage}
            className={`!mt-4 inline-block cursor-pointer rounded-lg bg-background p-3 text-sm font-bold hover:bg-blue-100`}
          >
            {LANGUAGES.find((lang) => lang.code === i18n.language)?.label ||
              LANGUAGES[0].label}
          </CustomButton> */}
          {/* <CustomButton
            onClick={() => {
              changeTheme(theme);
            }}
            className={`!mt-4 w-fit cursor-pointer rounded-lg bg-background p-3 text-sm font-bold hover:bg-blue-100`}
          >
            <MdDarkMode size="24" />
          </CustomButton> */}
          {/* <CustomButton
            onClick={() =>}
            className={`!mt-4 inline-block cursor-pointer rounded-lg bg-background p-3 text-sm font-bold hover:bg-blue-100`}
          >
            {LANGUAGES.find((lang) => lang.code === i18n.language)?.label ||
              LANGUAGES[0].label}
          </CustomButton> */}
        </div>
      </aside>
    </>
  );
};

export default SideMenu;
