import { Header } from "@xr3ngine/client-core/components/social//Header";
import { useRouter } from "next/router";
import React from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { pid } = router.query;

  return (
    <div className="container">
    <Header user={pid} />
      <div>{pid}</div>
    </div>
  );
}
