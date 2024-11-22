import { Suspense } from "react";
import Home from "../components/Home/Home";

export default function Page() {
  return (
    <Suspense>
      <div>
        <Home />
      </div>
    </Suspense>
  );
}
