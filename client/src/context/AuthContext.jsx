import { createContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '@/utils/api';

export const AuthContext = createContext();

const USER_STORAGE_KEY = 'jobportal_user';
const ACCESS_TOKEN_KEY = 'jobportal_access_token';

export const AuthContextProvider = (props) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || null;
  });

  const [loadingUser, setLoadingUser] = useState(true);

  // Helper to set user and token in state and localStorage
  const setAuth = (userObj, token) => {
    setUser(userObj);
    setAccessToken(token);
    if (userObj) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObj));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  };

  // Helper to check if refresh token cookie exists (not HttpOnly)
  const hasRefreshToken = () => {
    return document.cookie.split(';').some((cookie) => cookie.trim().startsWith('refreshToken='));
  };

  // Refresh access token using refresh token cookie
  const refreshAccessToken = useCallback(async () => {
     // Check for refresh token cookie
    if (!hasRefreshToken()) {
      setAuth(null, null);
      return null;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      const newAccessToken = data.accessToken || data.data?.accessToken;
      if (res.ok && newAccessToken) {
        setAccessToken(newAccessToken);
        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
        return newAccessToken;
      } else {
        setAuth(null, null);
        return null;
      }
    } catch (err) {
      setAuth(null, null);
      return null;
    }
  }, []);

  // Fetch current user from backend using access token, with refresh logic
  const fetchCurrentUser = useCallback(async () => {
    setLoadingUser(true);
    let token = accessToken;

    // If no token, try refreshing to see if there's a valid session
    if (!token) {
      token = await refreshAccessToken();
    }

    // If still no token, we can't do anything.
    if (!token) {
      setAuth(null, null);
      setLoadingUser(false);
      return;
    }

    // We have a token. Let's get the user.
    try {
      const res = await fetch(`${API_BASE_URL}/users/current`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const user = data.user || data.data?.user;
        if (user) {
          setAuth(user, token);
        } else {
          setAuth(null, null);
        }
      } else if (res.status === 401) {
        // Token was invalid. Let's try to refresh it ONE more time.
        const newToken = await refreshAccessToken();
        if (newToken) {
          // We got a new token, retry fetching user with it.
          const newRes = await fetch(`${API_BASE_URL}/users/current`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${newToken}`,
            },
          });

          if (newRes.ok) {
            const newData = await newRes.json();
            const newUser = newData.user || newData.data?.user;
            if (newUser) {
              setAuth(newUser, newToken);
            } else {
              setAuth(null, null);
            }
          } else {
            // Refresh worked but getting user failed. Logout.
            setAuth(null, null);
          }
        } else {
          // Refresh failed. Logout.
          setAuth(null, null);
        }
      } else {
        setAuth(null, null);
      }
    } catch (err) {
      setAuth(null, null);
    } finally {
      setLoadingUser(false);
    }
  }, [accessToken, refreshAccessToken]);

  useEffect(() => {
    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAuthenticated = !!user && !!accessToken;

  // Auth actions
  const login = async (form) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });
    const result = await res.json();
    let user = result.data?.user;
    let accessToken = result.data?.accessToken;
    if (res.ok && user && accessToken) {
      setAuth(user, accessToken);
      return { success: true };
    } else {
      setAuth(null, null);
      return { success: false, error: result };
    }
  };

  const register = async (form) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });
    const result = await res.json();
    let user = result.data?.user;
    let accessToken = result.data?.accessToken;
    if (res.ok && user && accessToken) {
      setAuth(user, accessToken);
      return { success: true };
    } else {
      setAuth(null, null);
      return { success: false, error: result };
    }
  };

  const logout = async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    });
    setAuth(null, null);
  };

  const value = {
    user,
    setUser,
    accessToken,
    isAuthenticated,
    fetchCurrentUser,
    loadingUser,
    login,
    register,
    logout,
    refreshAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};
