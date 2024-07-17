import { useRouteError } from "react-router-dom";

interface RouteError {
  status?: number;
  statusText?: string;
  message?: string;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Entschuldigung, ein Fehler ist aufgetreten.</p>
      <p>
        <i>{error.statusText || error.message || "Unbekannter Fehler"}</i>
      </p>
    </div>
  );
}
