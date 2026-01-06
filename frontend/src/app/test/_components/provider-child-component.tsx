import React from "react";
import { useProviderContext } from "./provider-component";
import Button from "./button";

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
      {/* <p>{`${state} (From ProvChildComp)`}</p> */}
      <div>
        <Button onClick={() => setState((prev) => !prev)}>
          Click Me (From ProvChildComp)
        </Button>
      </div>
    </>
  );
}
