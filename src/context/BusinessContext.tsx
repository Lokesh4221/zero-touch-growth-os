"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fallbackProfile,
  fallbackCalendar,
  fallbackCaptions,
  fallbackFestivals,
  fallbackAds,
  fallbackDashboardStats,
} from "@/lib/fallback-data";

type OnboardingData = {
  businessName: string;
  businessType: string;
  targetAudience: string;
  location: string;
  productsServices: string;
};

type BusinessContextType = {
  onboardingData: OnboardingData | null;
  setOnboardingData: (data: OnboardingData) => void;
  profile: any | null;
  setProfile: (profile: any) => void;
  calendar: any[] | null;
  setCalendar: (calendar: any[]) => void;
  captions: string[] | null;
  setCaptions: (captions: string[]) => void;
  festivals: any[] | null;
  setFestivals: (festivals: any[]) => void;
  ads: any[] | null;
  setAds: (ads: any[]) => void;
  stats: any | null;
  setStats: (stats: any) => void;
  clearData: () => void;
  loadFallbackData: () => void;
};

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [onboardingData, setOnboardingDataState] = useState<OnboardingData | null>(null);
  const [profile, setProfileState] = useState<any | null>(null);
  const [calendar, setCalendarState] = useState<any[] | null>(null);
  const [captions, setCaptionsState] = useState<string[] | null>(null);
  const [festivals, setFestivalsState] = useState<any[] | null>(null);
  const [ads, setAdsState] = useState<any[] | null>(null);
  const [stats, setStatsState] = useState<any | null>(null);

  useEffect(() => {
    // 1. First try to load from the Database (Real SaaS mode)
    const syncWithDb = async () => {
      try {
        const res = await fetch("/api/user/workspace");
        if (res.ok) {
          const workspace = await res.json();
          if (workspace) {
            if (workspace.businessName) setOnboardingDataState({
              businessName: workspace.businessName,
              businessType: workspace.businessType || "",
              targetAudience: workspace.targetAudience || "",
              location: workspace.location || "",
              productsServices: workspace.productsServices || "",
            });
            
            if (workspace.profileData) {
              try {
                const parsed = JSON.parse(workspace.profileData);
                setProfileState(parsed);
              } catch (e) {
                console.error("Failed to parse profile data from DB");
              }
            }
            return true; // Successfully synced
          }
        }
      } catch (error) {
        console.warn("DB Sync failed, falling back to local storage");
      }
      return false;
    };

    const init = async () => {
      const synced = await syncWithDb();
      if (synced) return;

      // 2. Fallback to localStorage (Legacy/Bootstrap mode)
      const savedData = localStorage.getItem("ztgos_state");
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.onboardingData) setOnboardingDataState(parsed.onboardingData);
          if (parsed.profile) setProfileState(parsed.profile);
          if (parsed.calendar) setCalendarState(parsed.calendar);
          if (parsed.captions) setCaptionsState(parsed.captions);
          if (parsed.festivals) setFestivalsState(parsed.festivals);
          if (parsed.ads) setAdsState(parsed.ads);
          if (parsed.stats) setStatsState(parsed.stats);
        } catch (e) {
          console.error("Failed to parse stored state");
        }
      }
    };

    init();
  }, []);

  const saveToStorage = (updates: any) => {
    const currentState = {
      onboardingData,
      profile,
      calendar,
      captions,
      festivals,
      ads,
      stats,
      ...updates,
    };
    localStorage.setItem("ztgos_state", JSON.stringify(currentState));
  };

  const setOnboardingData = (data: OnboardingData) => {
    setOnboardingDataState(data);
    saveToStorage({ onboardingData: data });
  };

  const setProfile = (data: any) => {
    setProfileState(data);
    saveToStorage({ profile: data });
  };

  const setCalendar = (data: any[]) => {
    setCalendarState(data);
    saveToStorage({ calendar: data });
  };

  const setCaptions = (data: string[]) => {
    setCaptionsState(data);
    saveToStorage({ captions: data });
  };

  const setFestivals = (data: any[]) => {
    setFestivalsState(data);
    saveToStorage({ festivals: data });
  };

  const setAds = (data: any[]) => {
    setAdsState(data);
    saveToStorage({ ads: data });
  };

  const setStats = (data: any) => {
    setStatsState(data);
    saveToStorage({ stats: data });
  };

  const clearData = () => {
    setOnboardingDataState(null);
    setProfileState(null);
    setCalendarState(null);
    setCaptionsState(null);
    setFestivalsState(null);
    setAdsState(null);
    setStatsState(null);
    localStorage.removeItem("ztgos_state");
  };

  const loadFallbackData = () => {
    const bName = onboardingData?.businessName || fallbackProfile.businessName;
    const dynamicProfile = {
      ...fallbackProfile,
      businessName: bName,
      industry: onboardingData?.businessType || fallbackProfile.industry,
      targetAudience: onboardingData?.targetAudience || fallbackProfile.targetAudience,
    };

    if (!profile) setProfile(dynamicProfile);

    // Deep copy and replace Zudio with actual business name
    const dynamicCalendar = JSON.parse(JSON.stringify(fallbackCalendar).replace(/Zudio/gi, bName));
    const dynamicCaptions = JSON.parse(JSON.stringify(fallbackCaptions).replace(/Zudio/gi, bName));
    const dynamicFestivals = JSON.parse(JSON.stringify(fallbackFestivals).replace(/Zudio/gi, bName));
    const dynamicAds = JSON.parse(JSON.stringify(fallbackAds).replace(/Zudio/gi, bName));

    setCalendar(dynamicCalendar);
    setCaptions(dynamicCaptions);
    setFestivals(dynamicFestivals);
    setAds(dynamicAds);
    setStats(fallbackDashboardStats);
  };

  return (
    <BusinessContext.Provider
      value={{
        onboardingData,
        setOnboardingData,
        profile,
        setProfile,
        calendar,
        setCalendar,
        captions,
        setCaptions,
        festivals,
        setFestivals,
        ads,
        setAds,
        stats,
        setStats,
        clearData,
        loadFallbackData,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
}
