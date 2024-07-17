import {
  LoaderFunctionArgs,
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StorageOwnerPage from "./pages/StorageOwnerPage";
import WorkshopOwnerPage from "./pages/WorkshopOwnerPage";
import SpareAccessoryDealerPage from "./pages/SpareAccessoryDealerPage";
import ClientPage from "./pages/ClientPage";
import SO_StorageComponent from "./components/StorageOwner/SO_StorageComponent";
import SO_CarsComponent from "./components/StorageOwner/SO_CarsComponent";
import SO_WorkshopsComponent from "./components/StorageOwner/SO_WorkshopsComponent";
import SO_NotificationsComponent from "./components/StorageOwner/SO_NotificationsComponent";
import WO_WorkshopComponent from "./components/WorkshopOwner/WO_WorkshopComponent";
import WO_NotificationsComponent from "./components/WorkshopOwner/WO_NotificationsComponent";
import SAD_HomeComponent from "./components/SpareAccessoryDealer/SAD_HomeComponent";
import C_CarsComponent from "./components/Client/C_CarsComponent";
import C_SpareaccessoriesComponent from "./components/Client/C_SpareaccessoriesComponent";
import C_NotificationsComponent from "./components/Client/C_NotificationsComponent";
import C_StoragesearchComponent from "./components/Client/C_StoragesearchComponent";
import { AuthData, deleteLocalStorage, getLocalStorage } from "./Auth";
import "./App.css";
import C_SpareaccessoriessearchComponent from "./components/Client/C_SpareaccessoriessearchComponent";

const loginMiddleware = () => {
  const authData: AuthData | null = getLocalStorage();
  if (authData?.token) {
    return redirect("/" + authData.userType);
  }
  return null;
};

const authMiddleware = ({ request }: LoaderFunctionArgs) => {
  const authData = getLocalStorage();

  if (!authData || !authData.token || !authData.userType) {
    return redirect("/");
  }

  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);

    if (pathSegments.length === 0) {
      return redirect("/" + authData.userType);
    }

    const currentPathType = pathSegments[0];

    if (currentPathType !== authData.userType) {
      return redirect("/" + authData.userType);
    }

    return null;
  } catch (error) {
    console.error("Fehler bei der Verarbeitung der URL:", error);
    return redirect("/");
  }
};

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        loader: loginMiddleware,
        Component: LoginPage,
      },
      {
        path: "register",
        Component: RegisterPage,
      },
      {
        path: "so",
        loader: authMiddleware,
        Component: StorageOwnerPage,
        children: [
          {
            path: "storage",
            Component: SO_StorageComponent,
          },
          {
            path: "cars",
            Component: SO_CarsComponent,
          },
          {
            path: "workshops",
            Component: SO_WorkshopsComponent,
          },
          {
            path: "notifications",
            Component: SO_NotificationsComponent,
          },
        ],
      },
      {
        path: "wo",
        loader: authMiddleware,
        Component: WorkshopOwnerPage,
        children: [
          {
            path: "workshop",
            Component: WO_WorkshopComponent,
          },
          {
            path: "notifications",
            Component: WO_NotificationsComponent,
          },
        ],
      },
      {
        path: "sad",
        loader: authMiddleware,
        Component: SpareAccessoryDealerPage,
        children: [
          {
            path: "home",
            Component: SAD_HomeComponent,
          },
        ],
      },
      {
        path: "c",
        loader: authMiddleware,
        Component: ClientPage,
        children: [
          {
            path: "cars",
            Component: C_CarsComponent,
          },
          {
            path: "spareaccessories",
            Component: C_SpareaccessoriesComponent,
          },
          {
            path: "notifications",
            Component: C_NotificationsComponent,
          },
          {
            path: "storagesearch",
            Component: C_StoragesearchComponent,
          },
          {
            path: "spareaccessoriessearch",
            Component: C_SpareaccessoriessearchComponent,
          },
        ],
      },
    ],
  },
  {
    path: "/logout",
    async loader() {
      deleteLocalStorage();
      return redirect("/");
    },
  },
]);

export default function App() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={<p>Initiales Laden...</p>}
    />
  );
}
