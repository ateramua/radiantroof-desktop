# Radiant Roof Realty Backup & Offline Data Guide

## Overview
This guide explains how the offline database initialization and encrypted backup/restore features work in Radiant Roof Realty.

It covers:
- why you are asked to enter a password on first launch
- how to export an encrypted backup
- how to import and restore backup data
- the difference between restore modes
- troubleshooting tips

---

## 1. Why you see the "Initialize Offline Database" prompt

When the app first starts, it needs to create and protect local offline data used by the app.

### Purpose of the prompt
- The prompt appears because the offline database has not been initialized yet.
- The app uses a password to encrypt locally stored data.
- This password is required to access or restore the offline database.

### Why it appears on the home/landing page
- The app blocks normal use until offline storage is initialized.
- If the database is not initialized, the initialization modal is shown immediately when the app loads.

### What to enter
- Enter a strong password that you will remember.
- This password is not the same as your user email/password.
- It is only used to protect local encrypted data.

> Tip: If you lose this password, the encrypted offline database cannot be decrypted.

---

## 2. How to export an encrypted backup

The backup export feature creates a file containing a secure snapshot of your app data.

### Step-by-step export
1. Open the app and go to the `Settings` page.
2. Find the **Export Backup** card in the Data Backup & Restore section.
3. Enter a strong password in the **Backup password** field.
4. Confirm the password in the second field.
5. Click **Export Backup**.
6. Choose a location to save the backup file when prompted.

### What is included
The exported backup contains:
- properties data
- users data
- app preferences
- app version and metadata

### Security
- The file is encrypted with AES-256-GCM.
- The password you enter protects the contents.

---

## 3. How to import a backup

You can restore data from a previously exported backup file.

### Step-by-step import
1. Open the app and go to `Settings`.
2. In the **Import Backup** card, click **Choose backup file**.
3. Select the `.rrbkp` or `.json` backup file.
4. Enter the backup password you used during export.
5. Click **Preview Backup** to verify the contents.
6. Choose the restore mode:
   - **Merge**: combine backup data with existing data
   - **Replace**: delete current data and replace it with backup data
7. Click **Restore Backup**.
8. Confirm the restore action if prompted.

### Preview helps verify
- Preview shows backup metadata such as app version, number of properties, users, and preferences.
- If the password is incorrect, decryption will fail and the preview will not load.

---

## 4. Restore modes explained

### Merge
- Keeps existing app data.
- Adds or updates items from the backup.
- Useful when you want to combine new backup content with current data.

### Replace
- Deletes the current data set first.
- Restores only the backup contents.
- Use this when you want a clean restore from the backup.

---

## 5. Password rules and warnings

- Use a strong password of at least 8 characters.
- The same password is required to preview and restore the backup.
- Do not reuse the export password for other apps unless you want to.
- Losing the password means losing access to the encrypted backup contents.

---

## 6. Notes for Electron vs web usage

- In Electron desktop builds, the app can use native file dialogs for export.
- In web/development mode, backup export may use browser file download behavior.
- The backup file format is the same in both cases.

---

## 7. Troubleshooting

### If you see the initialization prompt again
- The offline database was not initialized successfully.
- Re-enter the password and initialize again.

### If backup preview fails
- Check the backup password.
- Make sure the selected file is a valid Radiant Roof backup.

### If restore shows warnings
- Review errors in the console for details.
- A restore may still succeed partially if some records conflict or fail.

---

## 8. Recommended workflow

1. Initialize the offline database on first launch.
2. Export a backup regularly after important changes.
3. Keep the backup file in a safe location.
4. Use preview before restoring.
5. Choose merge only when you want to preserve current data.

---

## File location
This guide is stored in `docs/backup-user-guide.md`.
