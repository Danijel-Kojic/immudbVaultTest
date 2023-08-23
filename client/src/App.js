// project import
import Routes from "routes";
import ScrollTop from "components/ScrollTop";
import { AuthProvider } from "contexts/AuthContext";
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ScrollTop>
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </ScrollTop>
);

export default App;
