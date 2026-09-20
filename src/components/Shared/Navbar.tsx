/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ArrowUpRight,
  BadgeCheck,
  ChevronRight,
  LogIn,
  LogOut,
  Menu,
  Phone,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logout } from "@/server/auth/auth.service";
import { Toast } from "../Reusable/Toast";
import { useAuth } from "@/providers/AuthProvider";
import Swal from "sweetalert2";
import { Container } from "./Container";
import { ThemeToggle } from "./theme/ThemeToggle";
import Logo from "../Reusable/Logo";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  className?: string;
  menu?: MenuItem[];
}

const defaultMenu: MenuItem[] = [
  { title: "Home", url: "/" },
  { title: "Properties", url: "/properties" },
  { title: "About", url: "/about" },
  { title: "Privacy", url: "/privacy-policy" },
];

const Navbar = ({ menu = defaultMenu }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const { user, setUser, isLoggedIn } = useAuth();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // logout
  const handleLogOut = async () => {
    try {
      const result = await logout();

      if (!result.success) {
        Toast({
          icon: "error",
          title: result?.message || "Login failed",
        });
        return;
      }
      setUser(null);
      Swal.fire({
        icon: "success",
        title: "Logout successful",
        text: "You have been logged out successfully",
        confirmButtonColor: "#D43333",
      });
    } catch (error: any) {
      Toast({
        icon: "error",
        title: error?.message || "Logout failed",
      });
    }
  };

  return (
    <motion.section
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-full",
        scrolled ? "top-4 container px-4" : "top-0 max-w-full",
      )}
    >
      <section
        className={clsx(
          "transition-all duration-500 flex justify-center w-full",
          scrolled
            ? "rounded-full bg-background/60 backdrop-blur-sm shadow-[0_0_25px_rgba(0,0,0,0.2)] px-6"
            : "bg-background/80",
        )}
      >
        <Container className={`${scrolled && "px-3!"}`}>
          <div className="w-full">
            <DesktopMenu
              menu={menu}
              user={user}
              isLoggedIn={isLoggedIn}
              handleLogOut={handleLogOut}
            />

            <MobileMenu
              menu={menu}
              user={user}
              isLoggedIn={isLoggedIn}
              handleLogOut={handleLogOut}
            />
          </div>
        </Container>
      </section>
    </motion.section>
  );
};

// ====================== Desktop Menu ======================
const DesktopMenu = ({ menu, user, isLoggedIn, handleLogOut }: any) => {
  return (
    <nav className="hidden h-20 items-center lg:flex">
      <div className="flex w-full items-center justify-between">
        {/* logo */}
         <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/15" />

            <div className="relative">
              <Logo />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-bold leading-none tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
              Blood Bridge
            </span>

            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Blood Donation Platform
            </span>
          </div>
        </Link>

      {/* Right Side */}
        <div className="flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {menu.map((item: MenuItem) => (
                <DesktopMenuItem key={item.title} item={item} />
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="h-6 w-px bg-primary/70" />

          <div className="flex items-center gap-3">
            <AuthButtons
              isLoggedIn={isLoggedIn}
              user={user}
              handleLogOut={handleLogOut}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

// ====================== Auth ======================
const AuthButtons = ({ isLoggedIn, user, handleLogOut }: any) => {
  const { openLogin } = useAuth();
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
      {user ? (
        <div className="w-fit">
          <Link
            href={"/dashboard"}
            className="text-md font-semibold text-foreground lg:text-foreground bg-muted px-4 py-2 rounded-full hover:bg-muted/80 transition-colors duration-300 hover:text-primary border border-border/60"
          >
            Dashboard
          </Link>
        </div>
      ) : (
        <div></div>
      )}

      <div className="flex items-center gap-4 mt-8 md:mt-0">
        <ThemeToggle />
        {!isLoggedIn ? (
          <button
            onClick={openLogin}
            className="group flex h-10 items-center gap-2 rounded-xl bg-primary/10 px-4 text-sm font-semibold text-primary
            transition-all duration-300 hover:bg-primary hover:text-primary-foreground cursor-pointer
  "
          >
            <span>Login / Register</span>

            <span>
               <LogIn size={16}/>
            </span>
          </button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full cursor-pointer border border-primary/60 hover:border-primary">
                <Avatar>
                  <AvatarImage
                    src={user?.profilePhoto}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-72 rounded-xl border bg-background p-4 shadow-xl"
            >
              {/* Header */}
              <Link
                href={`/dashboard/${user?.role.toLowerCase()}/profile`}
                className="group mb-4 flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-foreground/3 p-3 transition-all hover:border-primary/20 hover:bg-foreground/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-11 w-11 border">
                    <AvatarImage
                      src={user?.profilePhoto}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="truncate text-sm font-semibold">
                        {user?.name}
                      </p>
                      {user?.isVerified && (
                        <div className="bg-primary text-primary-foreground rounded-full">
                          <BadgeCheck className="h-3 w-3" />
                        </div>
                      )}
                    </div>

                    <p className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground" />
              </Link>

              {/* Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    Phone
                  </span>
                  <span className="font-medium">{user?.phone}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-3.5 w-3.5" />
                    Role
                  </span>
                  <span className="font-medium">{user?.role}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 border-t pt-3">
                <button
                  onClick={handleLogOut}
                  className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer text-red-500 transition-all hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

// ====================== Desktop Menu Item ======================
const DesktopMenuItem = ({ item }: { item: MenuItem }) => {
  const pathname = usePathname();
  const isActive = pathname === item.url;

  // if (item.items) {
  //   return (
  //     <NavigationMenuItem>
  //       {/* <NavigationMenuTrigger
  //         className={clsx(
  //           "relative h-10 rounded-xl px-4 text-sm font-medium",
  //           "bg-transparent transition-all duration-300",
  //           "text-muted-foreground",
  //           "hover:bg-muted/70 hover:text-foreground",
  //           "data-[state=open]:bg-muted/70 data-[state=open]:text-foreground",
  //         )}
  //       >
  //         {item.title}
  //       </NavigationMenuTrigger> */}

  //       <NavigationMenuContent>
  //         {/* {item.items.map((subItem) => (
  //           <NavigationMenuLink asChild key={subItem.title}>
  //             <SubMenuLink item={subItem} />
  //           </NavigationMenuLink>
  //         ))} */}
  //       </NavigationMenuContent>
  //     </NavigationMenuItem>
  //   );
  // }

  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Link
          href={item.url}
          className={clsx(
            "group relative flex py-2 px-4 items-center rounded-xl",
            "text-sm font-medium",
            "transition-all duration-300 ease-out",

            !isActive && "text-muted-foreground",

            !isActive && "hover:bg-muted/70 hover:text-foreground",

            // Active
            isActive && "bg-primary/10 text-primary shadow-sm shadow-primary/5",
          )}
        >
          {/* Active indicator */}
          {isActive && (
            <span className="absolute left-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_8px_rgba(239,68,68,0.5)]"/>
          )}

          <span
            className={clsx(
              "transition-all duration-300",
              isActive && "translate-x-1.5",
              !isActive && "group-hover:translate-x-0.5",
            )}
          >
            {item.title}
          </span>
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

// ====================== Mobile Menu ======================
const MobileMenu = ({ menu, user, isLoggedIn, handleLogOut }: any) => {
  return (
    <div className="block lg:hidden py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
          <Link href="/">
            <p className="text-xl font-bold">Blood Bridge</p>
          </Link>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon">
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>

          <SheetContent className="overflow-y-auto lg:hidden">
            <SheetHeader>
              <SheetTitle className="flex items-center">
                <Logo />
                <p className="text-xl font-bold">Blood Bridge</p>
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-6 px-4">
              <Accordion
                type="single"
                collapsible
                className="flex w-fit flex-col"
              >
                {menu.map((item: MenuItem) => (
                  <MobileMenuItem key={item.title} item={item} />
                ))}
              </Accordion>

              <AuthButtons
                isLoggedIn={isLoggedIn}
                user={user}
                handleLogOut={handleLogOut}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

const MobileMenuItem = ({ item }: { item: MenuItem }) =>
  item.items ? (
    <AccordionItem value={item.title} className="border-b-0">
      <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
        {item.title}
      </AccordionTrigger>
      <AccordionContent className="mt-2">
        {item.items.map((subItem) => (
          <SubMenuLink key={subItem.title} item={subItem} />
        ))}
      </AccordionContent>
    </AccordionItem>
  ) : (
    <Link
      href={item.url}
      className="block text-md font-semibold py-3 px-1 hover:text-primary transition-colors"
    >
      {item.title}
    </Link>
  );

const SubMenuLink = ({ item }: { item: MenuItem }) => (
  <Link
    href={item.url}
    className="flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
  >
    {item.icon && <div className="text-foreground">{item.icon}</div>}
    <div>
      <div className="text-sm font-semibold">{item.title}</div>
      {item.description && (
        <p className="text-sm leading-snug text-muted-foreground">
          {item.description}
        </p>
      )}
    </div>
  </Link>
);

export { Navbar };
