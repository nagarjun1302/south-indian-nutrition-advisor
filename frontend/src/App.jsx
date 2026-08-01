import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { MealAnalyzerForm } from './components/MealAnalyzerForm';
import { AnalysisResults } from './components/AnalysisResults';
import { HistoryLog } from './components/HistoryLog';
import { IngredientKnowledge } from './components/IngredientKnowledge';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { checkBackendHealth } from './services/api';
import { supabase } from './supabaseClient';
import {
  fetchUserProfile,
  upsertUserProfile,
  fetchMealLogs,
  createMealLog,
  clearAllMealLogs,
} from './services/supabaseService';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendOk, setBackendOk] = useState(false);
  const [backendMsg, setBackendMsg] = useState('Checking API status...');

  // Modal controls
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Supabase Auth & Session State
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('nutrisense_profile');
      return saved
        ? JSON.parse(saved)
        : {
            name: '',
            email: '',
            age: '34',
            gender: 'male',
            targetWeight: '70',
            dietPref: 'Vegetarian (Pure Veg)',
            healthGoals: ['Type 2 Diabetes Control', 'Weight Loss & Fat Loss'],
          };
    } catch {
      return {
        name: '',
        email: '',
        healthGoals: ['Type 2 Diabetes Control'],
      };
    }
  });

  // Active Meal Analysis Result & Request
  const [currentResult, setCurrentResult] = useState(null);
  const [currentRequest, setCurrentRequest] = useState(null);

  // History state
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('nutrisense_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load user data from Supabase when logged in
  const loadUserDataFromSupabase = async (userId, userEmail, userName) => {
    if (!userId) return;

    // Fetch profile
    const remoteProfile = await fetchUserProfile(userId);
    if (remoteProfile) {
      setUserProfile(remoteProfile);
    } else {
      // First time login - save initial profile to Supabase
      const initialProfile = {
        name: userName || '',
        email: userEmail || '',
        age: userProfile.age || '34',
        gender: userProfile.gender || 'male',
        targetWeight: userProfile.targetWeight || '70',
        dietPref: userProfile.dietPref || 'Vegetarian (Pure Veg)',
        healthGoals: userProfile.healthGoals || ['Type 2 Diabetes Control'],
      };
      await upsertUserProfile(userId, initialProfile);
      setUserProfile(initialProfile);
    }

    // Fetch meal logs
    const remoteLogs = await fetchMealLogs(userId);
    if (remoteLogs && remoteLogs.length > 0) {
      setHistory(remoteLogs);
    }
  };

  // ─── SUPABASE SESSION CHECK & AUTH LISTENER ─────────────────────────────
  useEffect(() => {
    // 1) Fetch current session via supabase.auth.getSession()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const u = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
        };
        setUser(u);
        loadUserDataFromSupabase(u.id, u.email, u.name);
      } else {
        setUser(null);
      }
      setCheckingAuth(false);
    });

    // 2) Listen for auth state changes (login, logout, session refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        const u = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
        };
        setUser(u);
        loadUserDataFromSupabase(u.id, u.email, u.name);
      } else {
        setUser(null);
      }
      setCheckingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('nutrisense_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to persist history', e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('nutrisense_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.warn('Failed to persist profile', e);
    }
  }, [userProfile]);

  // Health check ping
  const checkHealth = async () => {
    const res = await checkBackendHealth();
    setBackendOk(res.ok);
    setBackendMsg(res.message);
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalysisComplete = async (result, requestData) => {
    setCurrentResult(result);
    setCurrentRequest(requestData);

    const historyItem = {
      ...result,
      id: Date.now().toString(),
      medical_conditions: requestData.medical_conditions,
      food_items: requestData.food_items,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setHistory((prev) => [historyItem, ...prev]);
    setActiveTab('results');

    // Save to Supabase if logged in
    if (user?.id) {
      const savedRecord = await createMealLog(user.id, historyItem);
      if (savedRecord?.id) {
        historyItem.id = savedRecord.id;
      }
    }
  };

  const handleSelectHistoryItem = (item) => {
    setCurrentResult(item);
    setCurrentRequest({
      patient_id: item.patient_id,
      patient_name: item.patient_name,
      meal_time: item.meal_time,
      food_items: item.food_items,
      medical_conditions: item.medical_conditions,
    });
    setActiveTab('results');
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all your meal history?')) {
      setHistory([]);
      if (user?.id) {
        await clearAllMealLogs(user.id);
      }
    }
  };

  const handleSaveProfile = async (updated) => {
    setUserProfile(updated);
    if (user?.id) {
      await upsertUserProfile(user.id, updated);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setActiveTab('dashboard');
  };

  // Protected page navigation handler
  const handleTabChange = (tab) => {
    // If no active session, prompt login modal for private user pages
    if (!session && tab !== 'ingredients') {
      setIsAuthOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        user={user}
        onOpenAuth={() => (session ? handleSignOut() : setIsAuthOpen(true))}
        onOpenProfile={() => handleTabChange('profile')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        backendOk={backendOk}
      />

      {/* Main Container */}
      <div className="main-content">
        <Navbar
          activeTab={activeTab}
          backendOk={backendOk}
          backendMessage={backendMsg}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onNewAnalysis={() => {
            if (!session) {
              setIsAuthOpen(true);
              return;
            }
            setCurrentResult(null);
            setCurrentRequest(null);
            setActiveTab('analyzer');
          }}
          user={user}
          onOpenAuth={() => (session ? handleSignOut() : setIsAuthOpen(true))}
          onOpenProfile={() => handleTabChange('profile')}
        />

        <main style={{ flex: 1 }}>
          {activeTab === 'dashboard' && (
            <DashboardOverview
              onStartAnalysis={() => {
                if (!session) {
                  setIsAuthOpen(true);
                  return;
                }
                setActiveTab('analyzer');
              }}
              onNavigateTab={handleTabChange}
              history={history}
              userProfile={userProfile}
              user={user}
            />
          )}

          {activeTab === 'analyzer' && (
            <MealAnalyzerForm
              backendOk={backendOk}
              onAnalysisComplete={handleAnalysisComplete}
              userProfile={userProfile}
            />
          )}

          {activeTab === 'results' && currentResult && currentRequest && (
            <AnalysisResults
              result={currentResult}
              requestData={currentRequest}
              onBackToForm={() => setActiveTab('analyzer')}
              onNewAnalysis={() => {
                setCurrentResult(null);
                setCurrentRequest(null);
                setActiveTab('analyzer');
              }}
            />
          )}

          {activeTab === 'history' && (
            <HistoryLog
              history={history}
              onSelectHistoryItem={handleSelectHistoryItem}
              onClearHistory={handleClearHistory}
            />
          )}

          {activeTab === 'ingredients' && <IngredientKnowledge />}

          {activeTab === 'profile' && (
            <UserProfileModal
              userProfile={userProfile}
              onSaveProfile={handleSaveProfile}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onRefreshHealth={checkHealth}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(newSession, newUser) => {
          setSession(newSession);
          if (newUser) {
            setUser({
              id: newUser.id,
              email: newUser.email,
              name: newUser.user_metadata?.full_name || newUser.email.split('@')[0],
            });
          }
        }}
      />
    </div>
  );
}

export default App;
