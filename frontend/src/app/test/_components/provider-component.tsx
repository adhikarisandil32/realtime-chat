import React, { useMemo } from "react";
import Button from "./button";

interface IProviderContext {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProviderContext = React.createContext<IProviderContext | undefined>(
  undefined
);

export const useProviderContext = () => {
  const context = React.useContext(ProviderContext);

  if (!context) {
    throw new Error("use context within ProviderContext wrapper");
  }

  return context;
};

export default function ProviderComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = React.useState<boolean>(false);
  const [test, setTest] = React.useState<string>("test");

  React.useEffect(() => {
    console.log("ProviderComponent mounted");
    setTest("not test");

    return () => {
      console.log("ProviderComponent unmounted");
    };
  });

  // const isFirstRender = React.useRef<boolean>(true);
  // React.useEffect(() => {
  //   if (isFirstRender.current) {
  //     isFirstRender.current = false;
  //     return;
  //   }
  //   console.log("setState's reference changed");
  // }, [setState]);

  // const values = useMemo(() => ({ state, setState }), []);
  const values = { state, setState, test, setTest };

  return (
    <ProviderContext.Provider value={values}>
      <div className="mx-auto w-7xl">
        <div className="w-fit mx-auto">
          <p>{`${state} (From ProviderComponent)`}</p>
          {children}
          <br />
          <Button
            onClick={() =>
              setTest((prev) => (prev === "test" ? "not test" : "test"))
            }
          >
            Click (From ProviderComponent) - {test}
          </Button>
        </div>
      </div>
    </ProviderContext.Provider>
  );
}
