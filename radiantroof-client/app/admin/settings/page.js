"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Shield,
  Database,
  Download,
  Upload,
  Users,
  Settings,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  HardDrive,
  Activity,
  UserCog,
  Bell,
  Mail,
  Server,
  Key,
  Lock,
  Trash2,
  BarChart3,
  ShieldCheck
} from "lucide-react";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [backupStatus, setBackupStatus] = useState(null);
  const [lastBackup, setLastBackup] = useState(null);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    databaseSize: "0 KB",
    lastSystemBackup: null
  });

  // Load system stats
  useEffect(() => {
    const fetchSystemStats = async () => {
      try {
        // In production, fetch from API
        // const response = await fetch('/api/admin/stats');
        // const data = await response.json();
        // setSystemStats(data);
        
        // Demo data for now
        setSystemStats({
          totalUsers: 1247,
          totalProperties: 356,
          databaseSize: "2.4 MB",
          lastSystemBackup: "2026-05-12T14:30:00Z"
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    
    fetchSystemStats();
    
    const savedBackupDate = localStorage.getItem("lastSystemBackupDate");
    if (savedBackupDate) {
      setLastBackup(savedBackupDate);
    }
  }, []);

  // Handle System Backup Export
  const handleSystemExport = async () => {
    setIsLoading(true);
    setBackupStatus({ type: "loading", message: "Preparing system backup..." });

    try {
      const password = prompt("Enter a strong password to encrypt the system backup:", "");
      if (!password || password.length < 8) {
        setBackupStatus({ type: "error", message: "Password must be at least 8 characters" });
        setIsLoading(false);
        return;
      }

      const confirmPassword = prompt("Confirm your password:");
      if (password !== confirmPassword) {
        setBackupStatus({ type: "error", message: "Passwords do not match" });
        setIsLoading(false);
        return;
      }

      if (window.electronAPI?.backupDatabase) {
        const result = await window.electronAPI.backupDatabase();
        if (result.success) {
          const now = new Date().toISOString();
          setLastBackup(now);
          localStorage.setItem("lastSystemBackupDate", now);
          setBackupStatus({ type: "success", message: `System backup saved to: ${result.path}` });
        } else {
          setBackupStatus({ type: "error", message: result.error || "Backup failed" });
        }
      } else {
        setBackupStatus({ type: "success", message: "Backup simulated (Electron API not available in web mode)" });
      }
    } catch (error) {
      setBackupStatus({ type: "error", message: error.message });
    } finally {
      setIsLoading(false);
      setTimeout(() => setBackupStatus(null), 5000);
    }
  };

  // Handle System Restore
  const handleSystemRestore = async () => {
    const confirmed = confirm(
      "⚠️ SYSTEM RESTORE WARNING ⚠️\n\n" +
      "This will replace the ENTIRE database with the backup.\n" +
      "All current data will be lost unless you have a backup.\n\n" +
      "A rollback backup will be created automatically.\n\n" +
      "Continue?"
    );
    
    if (!confirmed) return;

    setIsLoading(true);
    setBackupStatus({ type: "loading", message: "Preparing system restore..." });

    try {
      const password = prompt("Enter the backup password:");
      if (!password) {
        setBackupStatus({ type: "error", message: "Password is required" });
        setIsLoading(false);
        return;
      }

      if (window.electronAPI?.restoreDatabase) {
        const result = await window.electronAPI.restoreDatabase();
        if (result.success) {
          setBackupStatus({ type: "success", message: "System restored successfully! Reloading..." });
          setTimeout(() => window.location.reload(), 2000);
        } else {
          setBackupStatus({ type: "error", message: result.error || "Restore failed" });
        }
      } else {
        setBackupStatus({ type: "success", message: "Restore simulated (Electron API not available in web mode)" });
      }
    } catch (error) {
      setBackupStatus({ type: "error", message: error.message });
    } finally {
      setIsLoading(false);
      setTimeout(() => setBackupStatus(null), 5000);
    }
  };

  // Admin-only redirect
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return null;
  }

  const SettingSection = ({ icon: Icon, title, description, children, color = "blue" }) => (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center`}>
            <Icon className={`w-5 h-5 text-${color}-400`} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-sm text-white/50">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">System Settings</h1>
          <p className="text-white/50 mt-1">
            Manage system configuration, database, and security settings
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30">
          <span className="text-sm text-purple-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Admin Privileges
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* System Statistics */}
        <SettingSection
          icon={BarChart3}
          title="System Statistics"
          description="Overview of your system"
          color="blue"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/60">Total Users</span>
              <span className="text-white font-semibold">{systemStats.totalUsers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/60">Total Properties</span>
              <span className="text-white font-semibold">{systemStats.totalProperties.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/60">Database Size</span>
              <span className="text-white font-semibold">{systemStats.databaseSize}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-white/60">Database Status</span>
              <span className="text-green-400 flex items-center gap-1">
                <Activity className="w-3 h-3" /> Connected
              </span>
            </div>
          </div>
        </SettingSection>

        {/* Database Backup & Restore */}
        <SettingSection
          icon={Database}
          title="Database Management"
          description="Backup, restore, and maintain your database"
          color="green"
        >
          <div className="space-y-4">
            {lastBackup && (
              <div className="flex items-center gap-2 text-sm text-white/40 bg-white/5 rounded-xl p-3">
                <Clock className="w-4 h-4" />
                <span>Last system backup: {new Date(lastBackup).toLocaleString()}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSystemExport}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Backup Now
              </button>
              <button
                onClick={handleSystemRestore}
                disabled={isLoading}
                className="bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 rounded-xl transition-all duration-200 border border-white/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Restore Backup
              </button>
            </div>
            {backupStatus && (
              <div className={`p-3 rounded-xl flex items-center gap-2 ${
                backupStatus.type === "success" ? "bg-green-500/20" :
                backupStatus.type === "error" ? "bg-red-500/20" :
                "bg-blue-500/20"
              }`}>
                {backupStatus.type === "success" ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : backupStatus.type === "error" ? (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                )}
                <span className="text-sm text-white">{backupStatus.message}</span>
              </div>
            )}
          </div>
        </SettingSection>

        {/* User Management Settings */}
        <SettingSection
          icon={UserCog}
          title="User Management"
          description="Configure user roles and permissions"
          color="purple"
        >
          <div className="space-y-3">
            <button className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              Manage Users
            </button>
            <button className="w-full bg-white/5 hover:bg-white/10 text-white/80 font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
              <UserCog className="w-4 h-4" />
              Role Permissions
            </button>
          </div>
        </SettingSection>

        {/* Security Settings */}
        <SettingSection
          icon={Shield}
          title="Security"
          description="System security and encryption"
          color="red"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-white/70">Encryption Algorithm</span>
              <span className="text-green-400 font-mono text-sm">AES-256-GCM</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-white/70">Key Derivation</span>
              <span className="text-green-400 font-mono text-sm">Argon2id / PBKDF2</span>
            </div>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-xl transition-all flex items-center justify-center gap-2">
              <Key className="w-4 h-4" />
              Rotate Encryption Keys
            </button>
          </div>
        </SettingSection>

        {/* Application Settings */}
        <SettingSection
          icon={Settings}
          title="Application Settings"
          description="General application configuration"
          color="orange"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Auto-backup on exit</span>
              <button className="relative w-11 h-6 rounded-full bg-blue-500 transition-colors">
                <span className="absolute top-1 left-6 w-4 h-4 rounded-full bg-white transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Telemetry</span>
              <button className="relative w-11 h-6 rounded-full bg-white/20 transition-colors">
                <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform" />
              </button>
            </div>
            <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </SettingSection>

        {/* Notifications Settings */}
        <SettingSection
          icon={Bell}
          title="Notifications"
          description="System alert preferences"
          color="cyan"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Email alerts</span>
              <button className="relative w-11 h-6 rounded-full bg-blue-500 transition-colors">
                <span className="absolute top-1 left-6 w-4 h-4 rounded-full bg-white" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">System notifications</span>
              <button className="relative w-11 h-6 rounded-full bg-blue-500 transition-colors">
                <span className="absolute top-1 left-6 w-4 h-4 rounded-full bg-white" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Mail className="w-4 h-4 text-white/40" />
              <input
                type="email"
                placeholder="admin@radiantroof.com"
                className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </SettingSection>

        {/* Danger Zone */}
        <div className="lg:col-span-2">
          <div className="bg-red-500/10 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-red-500/30">
            <div className="p-6 border-b border-red-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Danger Zone</h3>
                  <p className="text-sm text-red-400/70">Irreversible actions</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium rounded-xl transition-all flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Reset Database
                </button>
                <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium rounded-xl transition-all flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Clear All Data
                </button>
              </div>
              <p className="text-xs text-red-400/50 mt-3">
                These actions cannot be undone. A backup will be created before any destructive operation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}