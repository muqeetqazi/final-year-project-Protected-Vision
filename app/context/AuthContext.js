import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AuthService } from '../services/AuthService';
// import { UserStatsService } from '../services/UserStatsService'; // Temporarily disabled

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  userStats: {
    total_documents_saved: 0,
    total_documents_processed: 0,
    total_documents_shared: 0,
    total_sensitive_items_detected: 0,
    total_non_detected_items: 0,
    detection_accuracy: 0,
  },
  statsLoading: false,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER',
  SET_USER_STATS: 'SET_USER_STATS',
  UPDATE_USER_STATS: 'UPDATE_USER_STATS',
  SET_STATS_LOADING: 'SET_STATS_LOADING',
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        isLoading: false,
      };

    case AUTH_ACTIONS.SET_USER_STATS:
      return {
        ...state,
        userStats: action.payload.stats,
        statsLoading: false,
      };

    case AUTH_ACTIONS.UPDATE_USER_STATS:
      return {
        ...state,
        userStats: {
          ...state.userStats,
          ...action.payload.updates,
        },
      };

    case AUTH_ACTIONS.SET_STATS_LOADING:
      return {
        ...state,
        statsLoading: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Load user stats when authenticated (temporarily disabled)
  // useEffect(() => {
  //   if (state.isAuthenticated) {
  //     loadUserStats();
  //   }
  // }, [state.isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      const isAuthenticated = await AuthService.isAuthenticated();
      if (isAuthenticated) {
        const user = await AuthService.getCurrentUser();
        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: { user },
        });
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const result = await AuthService.login(email, password);
      
      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: result.user },
        });
        return { success: true };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: { error: result.error },
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: errorMessage },
      });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });

    try {
      const result = await AuthService.register(userData);
      
      if (result.success) {
        dispatch({ type: AUTH_ACTIONS.REGISTER_SUCCESS });
        return { success: true, message: result.message };
      } else {
        dispatch({
          type: AUTH_ACTIONS.REGISTER_FAILURE,
          payload: { error: result.error },
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: { error: errorMessage },
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: true };
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const updateUser = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.SET_USER,
      payload: { user: userData },
    });
  };

  const loadUserStats = async () => {
    // Temporarily disabled
    // if (!state.isAuthenticated) return;
    
    // dispatch({ type: AUTH_ACTIONS.SET_STATS_LOADING, payload: true });
    
    // try {
    //   const result = await UserStatsService.getUserStats();
    //   if (result.success) {
    //     dispatch({
    //       type: AUTH_ACTIONS.SET_USER_STATS,
    //       payload: { stats: result.data },
    //     });
    //   }
    // } catch (error) {
    //   console.error('Load user stats error:', error);
    // }
  };

  const updateUserStats = (updates) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER_STATS,
      payload: { updates },
    });
  };

  const incrementDocumentSaved = async () => {
    // Temporarily disabled
    // const newValue = (state.userStats.total_documents_saved || 0) + 1;
    // updateUserStats({
    //   total_documents_saved: newValue,
    // });
    // // Sync with backend
    // await syncStatsWithBackend();
  };

  const incrementDocumentProcessed = async () => {
    // Temporarily disabled
    // const newValue = (state.userStats.total_documents_processed || 0) + 1;
    // updateUserStats({
    //   total_documents_processed: newValue,
    // });
    // // Sync with backend
    // await syncStatsWithBackend();
  };

  const incrementDocumentShared = async () => {
    // Temporarily disabled
    // const newValue = (state.userStats.total_documents_shared || 0) + 1;
    // updateUserStats({
    //   total_documents_shared: newValue,
    // });
    // // Sync with backend
    // await syncStatsWithBackend();
  };

  const incrementSensitiveDetected = async () => {
    // Temporarily disabled
    // const newValue = (state.userStats.total_sensitive_items_detected || 0) + 1;
    // updateUserStats({
    //   total_sensitive_items_detected: newValue,
    // });
    // // Sync with backend
    // await syncStatsWithBackend();
  };

  const incrementNonDetected = async () => {
    // Temporarily disabled
    // const newValue = (state.userStats.total_non_detected_items || 0) + 1;
    // updateUserStats({
    //   total_non_detected_items: newValue,
    // });
    // // Sync with backend
    // await syncStatsWithBackend();
  };

  // Sync local stats with backend
  const syncStatsWithBackend = async () => {
    // Temporarily disabled
    // try {
    //   // This will be implemented to update backend with current stats
    //   // For now, we'll reload stats from backend to ensure sync
    //   await loadUserStats();
    // } catch (error) {
    //   console.error('Sync stats error:', error);
    // }
  };

  const value = {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    userStats: state.userStats,
    statsLoading: state.statsLoading,
    
    // Actions
    login,
    register,
    logout,
    clearError,
    updateUser,
    checkAuthStatus,
    loadUserStats,
    updateUserStats,
    incrementDocumentSaved,
    incrementDocumentProcessed,
    incrementDocumentShared,
    incrementSensitiveDetected,
    incrementNonDetected,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
