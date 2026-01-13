import React from "react";

export default function ProviderChildTwo() {
  React.useEffect(() => {
    console.log("ProviderChildTwo mounted");

    return () => {
      console.log("ProviderChildTwo unmounted");
    };
  });
  return (
    <div>
      <p>This is Provider 2</p>
    </div>
  );
}
