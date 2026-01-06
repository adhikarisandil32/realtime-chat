"use client";

import ProviderChildTwo from "./_components/provider-child-2";
import ProvChildComp from "./_components/provider-child-component";
import ProviderComponent from "./_components/provider-component";

export default function TestPage() {
  return (
    <ProviderComponent>
      <ProvChildComp />
      <ProviderChildTwo />
    </ProviderComponent>
  );
}
