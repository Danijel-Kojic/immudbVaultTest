import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// project import
import useAuth from "hooks/useAuth";

// ==============================|| GUEST GUARD ||============================== //

const GuestGuard = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location?.pathname === "/") {
      navigate(
        isLoggedIn
          ? location?.state?.from
            ? location?.state?.from
            : "bank"
          : "login",
        {
          state: {
            from: "",
          },
          replace: true,
        }
      );
    }
    if (isLoggedIn) {
      navigate(location?.state?.from ? location?.state?.from : "bank", {
        state: {
          from: "",
        },
        replace: true,
      });
    }
  }, [isLoggedIn, navigate, location]);

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default GuestGuard;
