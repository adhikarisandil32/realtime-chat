import React from "react";

interface IProviderContext {
  // state: boolean;
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

  React.useEffect(() => {
    console.log("ProviderComponent mounted");

    return () => {
      console.log("ProviderComponent unmounted");
    };
  });

  const values = React.useMemo(() => ({ setState }), []);
  // const values = { setState };

  return (
    <div>
      <ProviderContext.Provider value={values}>
        {children}
      </ProviderContext.Provider>
      <div>
        <button onClick={() => setState((prev) => !prev)}>Click Me</button>
      </div>
    </div>
  );
}
