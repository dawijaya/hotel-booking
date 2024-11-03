"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import Container from "../Container";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ModeToggle } from "../theme-toggle";
import { NavMenu } from "./NavMenu";

const NavBar = () => {
  const router = useRouter();
  const { userId } = useAuth();

  return (
    <div className="sticky top-0 z-50 border border-b-primary/10 bg-secondary">
      <Container>
        <div className="flex justify-between items-center">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => router.push("/")}>
            <Image src="/logo.jpeg" alt="logo" width="30" height="30" />
            <div className="font-bold text-xl ">WisataBook</div>
          </div>
          <div className="flex gap-3 items-center">
            {/* Sembunyikan ModeToggle dan NavMenu jika userId tidak ada */}
            {userId ? (
              <>
                <div>
                  <ModeToggle />
                  <NavMenu />
                </div>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <Button
                  onClick={() => router.push("/sign-in")}
                  variant="outline"
                  size="sm">
                  Daftar
                </Button>
                <Button onClick={() => router.push("/sign-up")} size="sm">
                  Masuk
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NavBar;
