import { ReactElement } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Landingpage from './pages/Landingpage.tsx';
import SignUp from './pages/signUp/SignUp.tsx';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { deDE } from '@mui/x-date-pickers/locales';
import Homepage from './pages/Homepage.tsx';
import CreateListingPage from './pages/CreateListingPage.tsx';
import pb from './components/lib/pocketbase.ts';
import Profile from './pages/Profile.tsx';
import Garage from './pages/Garage.tsx';

function App(): ReactElement {
  const germanLocale =
    deDE.components.MuiLocalizationProvider.defaultProps.localeText;
  const authStore = pb.authStore.model;
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="de"
      localeText={germanLocale}
    >
      <BrowserRouter>
        <Routes>
          <Route index path={'/'} element={<Homepage />}></Route>
          <Route
            path={'/createListing'}
            element={
              authStore?.avatar && authStore?.phone_number !== '' ? (
                <CreateListingPage />
              ) : (
                <Landingpage></Landingpage>
              )
            }
          ></Route>
          <Route path={'/login'} element={<Login />} />
          <Route path={'/signup'} element={<SignUp />} />
          <Route path={'/profile'} element={<Profile />} />
          <Route path={'/garage'} element={<Garage />} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
