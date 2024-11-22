import React from "react";
import Link from "next/link";

const Custom404 = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>
        The page you are looking for might have been moved or doesn't exist.
      </p>
      <Link href="/">
        <a style={{ color: "blue" }}>Go back to Home</a>
      </Link>
    </div>
  );
};

export default Custom404;
