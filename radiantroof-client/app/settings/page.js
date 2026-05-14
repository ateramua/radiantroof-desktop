"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Shield,
  Database,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  Moon,
  Sun,
  Bell,
  BellOff,
  Globe,
  Lock,
  Key,
  RefreshCw,
  ChevronRight,
  HardDrive,
  ShieldCheck,
  Activity
} from "lucide-react";
import {
  createBackupPackage,
  encryptBackupPackage,
  createBackupBlob,
  saveBackupBlob,
  formatBackupFilename,
  decryptBackupPackage,
  readBackupFile
} from "../../lib/backup";
import {
  getProperties,
  getUsers,
  createProperty,
  updateProperty,
  deleteProperty,
  createUser,
  updateUser,
  deleteUser
} from "../../lib/api";

export default function GeneralSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [backupStatus, setBackupStatus] = useState(null);
  const [lastBackup, setLastBackup] = useState(null);
  const [preferences, setPreferences] = useState({
    theme: "dark",
    notifications: true,
    autoBackup: false,
    language: "en"
  });
  const [exportPassword, setExportPassword] = useState("");
  const [confirmExportPassword, setConfirmExportPassword] = useState("");
  const [importPassword, setImportPassword] = useState("");
  const [restoreMode, setRestoreMode] = useState("merge");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [backupPreview, setBackupPreview] = useState(null);
  const [previewError, setPreviewError] = useState(null);
  const fileInputRef = useRef(null);

  // Load saved preferences from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPrefs = localStorage.getItem("userPreferences");
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
      const savedBackupDate = localStorage.getItem("lastBackupDate");
      if (savedBackupDate) {
        setLastBackup(savedBackupDate);
      }
    }
  }, []);

  // Save preferences to localStorage
  const savePreference = (key, value) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem("userPreferences", JSON.stringify(updated));
    }
  };

  const getSavedPreferences = () => {
    if (typeof window === 'undefined') {
      return {
        theme: "dark",
        notifications: true,
        autoBackup: false,
        language: "en"
      };
    }

    const savedPrefs = localStorage.getItem("userPreferences");
    return savedPrefs ? JSON.parse(savedPrefs) : preferences;
  };

  const openBackupFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChoose = (event) => {
    const file = event.target.files?.[0];
    setBackupPreview(null);
    setPreviewError(null);
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
      setBackupStatus({ type: 'success', message: `Selected backup file: ${file.name}` });
    }
  };

  const getBackupData = async () => {
    const properties = await getProperties();
    const users = await getUsers();
    const preferencesData = getSavedPreferences();
    const appVersion = typeof window !== 'undefined' && window.electronAPI?.getAppVersion
      ? await window.electronAPI.getAppVersion()
      : process.env.NEXT_PUBLIC_APP_VERSION || 'unknown';

    return {
      properties: Array.isArray(properties) ? properties : [],
      users: Array.isArray(users) ? users : [],
      preferences: preferencesData,
      appVersion
    };
  };

  const handleExportBackup = async () => {
    setIsLoading(true);
    setBackupStatus({ type: "loading", message: "Encrypting backup package..." });

    try {
      if (!exportPassword || exportPassword.length < 8) {
        setBackupStatus({ type: "error", message: "Password must be at least 8 characters" });
        setIsLoading(false);
        return;
      }

      if (exportPassword !== confirmExportPassword) {
        setBackupStatus({ type: "error", message: "Passwords do not match" });
        setIsLoading(false);
        return;
      }

      const backupData = await getBackupData();
      const backupPackage = await createBackupPackage(backupData);
      const encryptedPackage = await encryptBackupPackage(backupPackage, exportPassword);
      const blob = createBackupBlob(encryptedPackage);
      await saveBackupBlob(blob, formatBackupFilename());

      const now = new Date().toISOString();
      setLastBackup(now);
      if (typeof window !== 'undefined') {
        localStorage.setItem("lastBackupDate", now);
      }

      setExportPassword("");
      setConfirmExportPassword("");
      setBackupStatus({ type: "success", message: "Encrypted backup exported successfully." });
    } catch (error) {
      setBackupStatus({ type: "error", message: error.message || "Backup failed" });
    } finally {
      setIsLoading(false);
      setTimeout(() => setBackupStatus(null), 5000);
    }
  };

  const handleLoadBackupPreview = async () => {
    if (!selectedFile) {
      setPreviewError('Please select a backup file first.');
      return;
    }

    if (!importPassword) {
      setPreviewError('Please enter the backup password to preview.');
      return;
    }

    setIsLoading(true);
    setBackupStatus({ type: 'loading', message: 'Decrypting backup preview...' });

    try {
      const sourceText = await readBackupFile(selectedFile);
      const backup = await decryptBackupPackage(sourceText, importPassword);

      if (!backup.payload || !backup.payload.data) {
        throw new Error('Backup file is missing expected payload');
      }

      setBackupPreview({
        createdAt: backup.createdAt || backup.payload.createdAt || new Date().toISOString(),
        appVersion: backup.payload.appVersion || backup.metadata?.appVersion || 'unknown',
        environment: backup.metadata?.environment || 'unknown',
        propertiesCount: Array.isArray(backup.payload.data.properties) ? backup.payload.data.properties.length : 0,
        usersCount: Array.isArray(backup.payload.data.users) ? backup.payload.data.users.length : 0,
        preferencesCount: Object.keys(backup.payload.data.preferences || {}).length,
      });
      setPreviewError(null);
      setBackupStatus({ type: 'success', message: 'Backup preview ready.' });
    } catch (error) {
      setBackupPreview(null);
      setPreviewError(error.message);
      setBackupStatus({ type: 'error', message: error.message || 'Preview failed' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setBackupStatus(null), 5000);
    }
  };

  const restoreBackupData = async (data, mode) => {
    const summary = {
      propertiesCreated: 0,
      propertiesUpdated: 0,
      propertiesDeleted: 0,
      usersCreated: 0,
      usersUpdated: 0,
      preferencesRestored: false,
      errors: []
    };

    try {
      const currentProperties = await getProperties();
      const currentUsers = await getUsers();

      if (mode === 'replace') {
        await Promise.all(currentProperties.map(async (item) => {
          try {
            await deleteProperty(item.id);
            summary.propertiesDeleted += 1;
          } catch (error) {
            summary.errors.push(`Property delete failed: ${item.id} - ${error.message}`);
          }
        }));

        await Promise.all(currentUsers.map(async (item) => {
          try {
            await deleteUser(item.id);
            summary.usersDeleted = (summary.usersDeleted || 0) + 1;
          } catch (error) {
            summary.errors.push(`User delete failed: ${item.id} - ${error.message}`);
          }
        }));
      }

      const propertyMap = new Map(currentProperties.map((item) => [item.id, item]));
      for (const property of data.properties || []) {
        try {
          if (property.id && propertyMap.has(property.id)) {
            await updateProperty(property.id, property);
            summary.propertiesUpdated += 1;
          } else {
            await createProperty({ ...property });
            summary.propertiesCreated += 1;
          }
        } catch (error) {
          summary.errors.push(`Property restore failed: ${property.id || 'new'} - ${error.message}`);
        }
      }

      const userMap = new Map(currentUsers.map((item) => [item.email, item]));
      for (const userItem of data.users || []) {
        try {
          const existing = userMap.get(userItem.email);
          if (existing) {
            await updateUser(existing.id, {
              name: userItem.name,
              role: userItem.role,
              email: userItem.email
            });
            summary.usersUpdated += 1;
          } else {
            await createUser({
              name: userItem.name,
              email: userItem.email,
              password: userItem.password || Math.random().toString(36).slice(-12)
            });
            summary.usersCreated += 1;
          }
        } catch (error) {
          summary.errors.push(`User restore failed: ${userItem.email} - ${error.message}`);
        }
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(data.preferences || {}));
        summary.preferencesRestored = true;
      }
    } catch (error) {
      summary.errors.push(`Restore process failed: ${error.message}`);
    }

    return summary;
  };

  const handleRestoreBackup = async () => {
    if (!selectedFile) {
      setBackupStatus({ type: 'error', message: 'Please select a backup file first.' });
      return;
    }

    if (!importPassword) {
      setBackupStatus({ type: 'error', message: 'Backup password is required.' });
      return;
    }

    const confirmed = confirm(
      restoreMode === 'replace'
        ? '⚠️ This restore mode will replace your current data. Continue?'
        : '⚠️ Merge will combine backup data with current data. Continue?'
    );

    if (!confirmed) return;

    setIsLoading(true);
    setBackupStatus({ type: 'loading', message: 'Decrypting backup and restoring data...' });

    try {
      const sourceText = await readBackupFile(selectedFile);
      const backup = await decryptBackupPackage(sourceText, importPassword);

      if (!backup.payload || !backup.payload.data) {
        throw new Error('Backup payload is invalid or missing required fields.');
      }

      const restoreSummary = await restoreBackupData(backup.payload.data, restoreMode);
      const messageParts = [];
      if (restoreSummary.propertiesCreated) messageParts.push(`${restoreSummary.propertiesCreated} properties created`);
      if (restoreSummary.propertiesUpdated) messageParts.push(`${restoreSummary.propertiesUpdated} properties updated`);
      if (restoreSummary.propertiesDeleted) messageParts.push(`${restoreSummary.propertiesDeleted} properties deleted`);
      if (restoreSummary.usersCreated) messageParts.push(`${restoreSummary.usersCreated} users created`);
      if (restoreSummary.usersUpdated) messageParts.push(`${restoreSummary.usersUpdated} users updated`);
      if (restoreSummary.usersDeleted) messageParts.push(`${restoreSummary.usersDeleted} users deleted`);
      if (restoreSummary.preferencesRestored) messageParts.push(`preferences restored`);
      if (restoreSummary.errors.length) {
        messageParts.push(`with ${restoreSummary.errors.length} warning(s)`);
      }

      setBackupStatus({
        type: restoreSummary.errors.length ? 'error' : 'success',
        message: restoreSummary.errors.length
          ? `Restore completed with warnings. Check the console for details.`
          : `Restore completed successfully. ${messageParts.join(', ')}`
      });

      if (restoreSummary.errors.length) {
        console.error('Backup restore warnings:', restoreSummary.errors);
      }

      setBackupPreview(null);
      setSelectedFile(null);
      setSelectedFileName('');
      setImportPassword('');
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setBackupStatus({ type: 'error', message: error.message || 'Restore failed' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setBackupStatus(null), 5000);
    }
  };

  // Redirect if not authenticated (optional - settings can be accessed before login for backup/restore)
  // Uncomment if you want to restrict settings to authenticated users only
  // useEffect(() => {
  //   if (!user && typeof window !== 'undefined') {
  //     router.push('/login');
  //   }
  // }, [user, router]);

  const SettingCard = ({ icon: Icon, title, description, children, color = "blue" }) => (
    <div className="group relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20 hover:border-white/30 transition-all duration-300">
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-${color}-500 to-${color}-600`}></div>
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center`}>
            <Icon className={`w-5 h-5 text-${color}-400`} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-sm text-white/50">{description}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="relative max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/60">Manage your account preferences and data backup</p>
        </div>

        {/* Account Summary Card */}
        {user && (
          <div className="mb-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">{user.name || "User"}</p>
                  <p className="text-sm text-white/50">{user.email}</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                <span className="text-xs text-green-400">Logged in as {user.role || "user"}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Backup & Restore Section */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              Data Backup & Restore
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Export Backup Card */}
              <SettingCard
                icon={Download}
                title="Export Backup"
                description="Create an encrypted backup of all your data"
                color="blue"
              >
                <div className="space-y-3">
                  {lastBackup && (
                    <div className="flex items-center gap-2 text-sm text-white/40">
                      <Clock className="w-4 h-4" />
                      <span>Last backup: {new Date(lastBackup).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="space-y-3">
                    <label className="block text-sm text-white/80">
                      Backup password
                    </label>
                    <input
                      type="password"
                      value={exportPassword}
                      onChange={(e) => setExportPassword(e.target.value)}
                      placeholder="Enter a strong password"
                      className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="password"
                      value={confirmExportPassword}
                      onChange={(e) => setConfirmExportPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleExportBackup}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {isLoading ? "Processing..." : "Export Backup"}
                  </button>
                </div>
              </SettingCard>

              {/* Import Backup Card */}
              <SettingCard
                icon={Upload}
                title="Import Backup"
                description="Restore your data from an encrypted backup"
                color="purple"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  onChange={handleFileChoose}
                  className="hidden"
                />
                <div className="space-y-3">
                  <button
                    onClick={openBackupFilePicker}
                    disabled={isLoading}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 rounded-xl transition-all duration-200 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Choose backup file
                  </button>
                  {selectedFileName && (
                    <div className="text-sm text-white/70">Selected: {selectedFileName}</div>
                  )}
                  <input
                    type="password"
                    value={importPassword}
                    onChange={(e) => setImportPassword(e.target.value)}
                    placeholder="Backup password"
                    className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleLoadBackupPreview}
                      disabled={isLoading || !selectedFile}
                      className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-medium py-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Preview Backup
                    </button>
                    <button
                      onClick={handleRestoreBackup}
                      disabled={isLoading || !selectedFile}
                      className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-xl border border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Restore Backup
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Restore mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRestoreMode('merge')}
                        className={`py-2 rounded-xl text-sm font-medium transition-all ${restoreMode === 'merge'
                          ? 'bg-white/20 border border-white/30 text-white'
                          : 'bg-white/5 border border-white/10 text-white/70'}`}
                      >
                        Merge
                      </button>
                      <button
                        type="button"
                        onClick={() => setRestoreMode('replace')}
                        className={`py-2 rounded-xl text-sm font-medium transition-all ${restoreMode === 'replace'
                          ? 'bg-white/20 border border-white/30 text-white'
                          : 'bg-white/5 border border-white/10 text-white/70'}`}
                      >
                        Replace
                      </button>
                    </div>
                  </div>
                  {backupPreview && (
                    <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-sm text-white/80">
                      <p><strong>Backup preview</strong></p>
                      <p>App version: {backupPreview.appVersion}</p>
                      <p>Properties: {backupPreview.propertiesCount}</p>
                      <p>Users: {backupPreview.usersCount}</p>
                      <p>Preferences: {backupPreview.preferencesCount}</p>
                    </div>
                  )}
                  {previewError && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">
                      {previewError}
                    </div>
                  )}
                </div>
              </SettingCard>
            </div>

            {/* Status Message */}
            {backupStatus && (
              <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
                backupStatus.type === "success" ? "bg-green-500/20 border border-green-500/30" :
                backupStatus.type === "error" ? "bg-red-500/20 border border-red-500/30" :
                "bg-blue-500/20 border border-blue-500/30"
              }`}>
                {backupStatus.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : backupStatus.type === "error" ? (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                )}
                <span className="text-sm text-white">{backupStatus.message}</span>
              </div>
            )}
          </div>

          {/* Appearance Section */}
          <SettingCard
            icon={preferences.theme === "dark" ? Moon : Sun}
            title="Appearance"
            description="Customize how the app looks"
            color="green"
          >
            <div className="flex gap-3">
              <button
                onClick={() => savePreference("theme", "dark")}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  preferences.theme === "dark"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                <Moon className="w-4 h-4" /> Dark
              </button>
              <button
                onClick={() => savePreference("theme", "light")}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  preferences.theme === "light"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                <Sun className="w-4 h-4" /> Light
              </button>
            </div>
          </SettingCard>

          {/* Notifications Section */}
          <SettingCard
            icon={preferences.notifications ? Bell : BellOff}
            title="Notifications"
            description="Manage your alert preferences"
            color="orange"
          >
            <div className="flex items-center justify-between">
              <span className="text-white/70">Email notifications</span>
              <button
                onClick={() => savePreference("notifications", !preferences.notifications)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  preferences.notifications ? "bg-blue-500" : "bg-white/20"
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  preferences.notifications ? "left-7" : "left-1"
                }`} />
              </button>
            </div>
          </SettingCard>

          {/* Security Section */}
          <SettingCard
            icon={Lock}
            title="Security"
            description="Manage your security settings"
            color="red"
          >
            <button className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-xl transition-all flex items-center justify-center gap-2">
              <Key className="w-4 h-4" />
              Change Password
            </button>
          </SettingCard>

          {/* Database Info Section */}
          <SettingCard
            icon={HardDrive}
            title="Database Information"
            description="View database status and location"
            color="cyan"
          >
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Status</span>
                <span className="text-green-400 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Connected
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Encryption</span>
                <span className="text-white">AES-256-GCM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Last Backup</span>
                <span className="text-white">{lastBackup ? new Date(lastBackup).toLocaleDateString() : "Never"}</span>
              </div>
            </div>
          </SettingCard>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-white/30 text-xs">
          <p>IntentFlow Desktop Application — Secure Offline-First Architecture</p>
          <p className="mt-1">All data is encrypted locally. No cloud storage used.</p>
        </div>
      </div>
    </div>
  );
}