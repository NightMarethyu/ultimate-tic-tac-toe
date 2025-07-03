import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="display-1">Hello There</h1>
    </>
  );
};

export default HomePage;