"use client";

import ProviderChildOne from "./_components/provider-child-1";
import ProviderChildTwo from "./_components/provider-child-2";
import ProviderComponent from "./_components/provider-component";

export default function TestPage() {
  return (
    <ProviderComponent>
      <ProviderChildOne />
      <ProviderChildTwo />
    </ProviderComponent>
  );
}
