import React, { useEffect, useState } from "react";
import { Game } from "../components/Game";

export const Index = () => {
  const [onClient, setOnClient] = useState(false);
  useEffect(() => {
    setOnClient(true);
  }, []);

  return <>{onClient && <Game />}</>;
};

export default Index;
