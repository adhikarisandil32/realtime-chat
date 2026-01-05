import React from "react";
import { useProviderContext } from "./provider-component";

export default function ProvChildComp() {
  const { setState } = useProviderContext();

  React.useEffect(() => {
    console.log("ProvChildComp mounted");

    return () => {
      console.log("ProvChildComp unmounted");
    };
  });

  return (
    <>
      <p>I&apos;m a p tag</p>
      <div>
        <button onClick={() => setState((prev) => !prev)}>
          Click Me (From ProvChildComp)
        </button>
      </div>
    </>
  );
}
