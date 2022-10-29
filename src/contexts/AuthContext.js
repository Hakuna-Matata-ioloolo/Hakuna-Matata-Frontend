import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import axios from '../utils/axios';
import { setSession } from '../utils/token';

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

AuthProvider.propTypes = {
  children: PropTypes.node
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken) {
          setSession(accessToken);

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user: (await axios.get('/api/account')).data
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (phoneNumber, password) => {
    const response = await axios.post('/api/account', {
      phoneNumber,
      password
    });

    setSession(response.data.token);

    dispatch({
      type: 'LOGIN',
      payload: {
        user: (await axios.get('/api/account')).data
      }
    });
  };

  const register = async (name, phoneNumber, school, grade, clazz, stdId, password) => {
    const response = await axios.put('/api/account', {
      name,
      phoneNumber,
      school,
      grade,
      clazz,
      stdId,
      password
    });

    setSession(response.data.token);

    dispatch({
      type: 'REGISTER',
      payload: {
        user: (await axios.get('/api/account')).data
      }
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
