const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const bytesToBase64 = (bytes) => {
  let binary = '';
  const len = bytes.length;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const base64ToBytes = (base64) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const deriveKey = async (password, salt) => {
  if (!password) throw new Error('Password is required for backup encryption');
  const baseKey = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 250000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

export const createBackupPackage = async ({ properties, users, preferences, appVersion }) => {
  const createdAt = new Date().toISOString();
  const payload = {
    appName: 'Radiant Roof Realty',
    createdAt,
    version: '1.0',
    data: {
      properties: properties || [],
      users: users || [],
      preferences: preferences || {},
    },
    metadata: {
      propertiesCount: Array.isArray(properties) ? properties.length : 0,
      usersCount: Array.isArray(users) ? users.length : 0,
      preferencesCount: Object.keys(preferences || {}).length,
      environment: typeof window !== 'undefined' && window.electronAPI ? 'electron' : 'web',
      appVersion: appVersion || null,
    }
  };

  return payload;
};

export const encryptBackupPackage = async (backupPackage, password) => {
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const encoded = textEncoder.encode(JSON.stringify(backupPackage));
  const cipherBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

  return {
    type: 'RadiantRoofBackup',
    version: '1.0',
    createdAt: backupPackage.createdAt,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(cipherBuffer)),
    metadata: backupPackage.metadata
  };
};

export const decryptBackupPackage = async (encryptedText, password) => {
  let parsed;
  try {
    parsed = JSON.parse(encryptedText);
  } catch (error) {
    throw new Error('Invalid backup file format');
  }

  if (!parsed || parsed.type !== 'RadiantRoofBackup' || !parsed.ciphertext) {
    throw new Error('This file is not a valid Radiant Roof backup');
  }

  const salt = base64ToBytes(parsed.salt);
  const iv = base64ToBytes(parsed.iv);
  const ciphertext = base64ToBytes(parsed.ciphertext);
  const key = await deriveKey(password, salt);

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    const decryptedText = textDecoder.decode(decryptedBuffer);
    const payload = JSON.parse(decryptedText);

    return {
      ...parsed,
      payload,
    };
  } catch (error) {
    throw new Error('Unable to decrypt backup. Check your password or the file integrity.');
  }
};

export const readBackupFile = async (file) => {
  if (!(file instanceof File)) {
    throw new Error('Invalid backup file');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Unable to read the backup file')); 
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

export const createBackupBlob = (encryptedBackup) => {
  const json = JSON.stringify(encryptedBackup, null, 2);
  return new Blob([json], { type: 'application/json' });
};

export const saveBackupBlob = async (blob, filename) => {
  if (typeof window === 'undefined') {
    throw new Error('Backup export is only supported in the browser renderer.');
  }

  if (window.showSaveFilePicker) {
    const handle = await window.showSaveFilePicker({
      suggestedName: filename,
      types: [
        {
          description: 'Radiant Roof Backup File',
          accept: { 'application/json': ['.rrbkp', '.json'] }
        }
      ]
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const formatBackupFilename = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `radiantroof-backup-${timestamp}.rrbkp`;
};
