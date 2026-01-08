import React, { useMemo } from "react";
import Button from "./button";

interface IProviderContext {
  Setters: {
    setState: React.Dispatch<React.SetStateAction<boolean>>;
    setTest: React.Dispatch<React.SetStateAction<string>>;
  };
  Getters: {
    state: boolean;
    test: string;
  };
}

const SettersProviderContext = React.createContext<
  IProviderContext["Setters"] | undefined
>(undefined);

const GettersProviderContext = React.createContext<
  IProviderContext["Getters"] | undefined
>(undefined);

export const useProviderSettersContext = () => {
  const context = React.useContext(SettersProviderContext);
  if (!context) {
    throw new Error("use context within ProviderContext wrapper");
  }

  return context;
};

export const useProviderGettersContext = () => {
  const context = React.useContext(GettersProviderContext);
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
    // setTest("not test");

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

  const setterValues = useMemo(() => ({ setTest, setState }), []);
  // const setterValues = { setTest, setState };
  const getterValues = { state, test };

  return (
    <SettersProviderContext.Provider value={setterValues}>
      <GettersProviderContext.Provider value={getterValues}>
        <div className="mx-auto w-7xl">
          <div className="w-fit mx-auto">
            {children}
            <br />
            <Button
              onClick={() =>
                setTest((prev) => (prev === "test" ? "not test" : "test"))
              }
            >
              Click (From ProviderComponent)
            </Button>
          </div>
        </div>
      </GettersProviderContext.Provider>
    </SettersProviderContext.Provider>
  );
}
