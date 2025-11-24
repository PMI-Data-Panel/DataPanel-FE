import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import 컴포넌트
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import { SearchProvider } from "./provider/SearchProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import SearchResults from "./pages/SearchResults";

const queryClient = new QueryClient();
// 라우팅
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/search/results",
        element: <SearchResults />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="w-full max-w-full min-h-screen overflow-x-hidden">
      <QueryClientProvider client={queryClient}>
        <SearchProvider>
          <RouterProvider router={router} />
        </SearchProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={true} />}
      </QueryClientProvider>
    </div>
  );
}

export default App;
