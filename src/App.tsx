/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AuthProvider } from "./context/AuthContext";
import RestaurantApp from "./components/RestaurantApp";

export default function App() {
  return (
    <AuthProvider>
      <RestaurantApp />
    </AuthProvider>
  );
}
