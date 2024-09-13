import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GiftCard, Layout, Payment } from "./routes/routes";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Layout />
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <GiftCard />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "giftcard/payment",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Payment />
        </Suspense>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}
