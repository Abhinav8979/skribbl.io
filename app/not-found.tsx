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
        <p style={{ color: "blue" }}>Go back to Home</p>
      </Link>
    </div>
  );
};

export default Custom404;
