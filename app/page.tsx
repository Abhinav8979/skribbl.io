import { Suspense } from "react";
import Home from "../components/Home/Home";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <Home />
      </div>
    </Suspense>
  );
}
