import React from "react";
import { useProviderSettersContext } from "./provider-component";
import Button from "./button";

export default function ProviderChildOne() {
  const { setState } = useProviderSettersContext();

  React.useEffect(() => {
    console.log("ProviderChildOne mounted");

    return () => {
      console.log("ProviderChildOne unmounted");
    };
  });

  return (
    <>
      {/* <p>{`${state} (From ProvChildComp)`}</p> */}
      <div>
        <Button onClick={() => setState((prev) => !prev)}>
          Click Me (From ProviderChildOne)
        </Button>
      </div>
    </>
  );
}
