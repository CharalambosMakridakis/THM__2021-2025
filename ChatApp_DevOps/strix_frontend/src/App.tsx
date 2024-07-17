import StateChanger from "./components/StateChanger";
import { AuthProvider } from "./provides/AuthContext";
import { SocketProvider } from "./provides/SocketContext";
import { RoomProvider } from "./provides/RoomContext";
import { EditProfileProvider } from "./provides/EditProfilContext";

const App: React.FC = () => {
  return (
    <SocketProvider>
      <AuthProvider>
        <EditProfileProvider>
          <RoomProvider>
            <StateChanger />
          </RoomProvider>
        </EditProfileProvider>
      </AuthProvider>
    </SocketProvider>
    );
};

export default App;
