"use client";

import ProvChildComp from "./_components/provider-child-component";
import ProviderComponent from "./_components/provider-component";

export default function TestPage() {
  return (
    <ProviderComponent>
      <ProvChildComp />
    </ProviderComponent>
  );
}
