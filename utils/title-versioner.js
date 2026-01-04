/**
 * Chat title versioning logic with persistent storage
 * Handles "Part X" suffix parsing and incrementing
 */

const TitleVersioner = {
  // Pattern to match titles ending with "– Part N"
  // Handles variations in spacing and case
  PART_PATTERN: /^(.*?)\s*[–—-]\s*Part\s+(\d+)\s*$/i,

  // Storage key for title index
  STORAGE_KEY: 'chatTitleIndex',

  /**
   * Parse title to extract base name and version number
   * @param {string} title - Original chat title
   * @returns {{base: string, version: number}} - Parsed components
   */
  parseTitle(title) {
    if (!title || typeof title !== 'string') {
      return { base: 'Untitled Chat', version: 0 };
    }

    const match = title.trim().match(this.PART_PATTERN);

    if (match) {
      return {
        base: match[1].trim(),
        version: parseInt(match[2], 10)
      };
    }

    // No version suffix found
    return {
      base: title.trim(),
      version: 0
    };
  },

  /**
   * Get next version number for a title and format it
   * @param {string} currentTitle - Current chat title
   * @returns {Promise<string>} - Versioned title (e.g., "Spring Boot – Part 2")
   */
  async getNextVersion(currentTitle) {
    const { base, version } = this.parseTitle(currentTitle);

    // Get stored index from chrome.storage
    const stored = await chrome.storage.local.get(this.STORAGE_KEY);
    const titleIndex = stored[this.STORAGE_KEY] || {};

    // Determine next version number
    let nextVersion;

    if (version > 0) {
      // Title already has "Part N" suffix, increment it
      nextVersion = version + 1;
    } else {
      // No version yet, check storage for existing versions
      nextVersion = (titleIndex[base] || 0) + 1;
    }

    // Update storage with new version
    titleIndex[base] = nextVersion;
    await chrome.storage.local.set({ [this.STORAGE_KEY]: titleIndex });

    // Format with em dash (–)
    return `${base} – Part ${nextVersion}`;
  },

  /**
   * Manually update title index (for corrections or testing)
   * @param {string} baseTitle - Base title without version suffix
   * @param {number} version - Version number to set
   */
  async updateTitleIndex(baseTitle, version) {
    const stored = await chrome.storage.local.get(this.STORAGE_KEY);
    const titleIndex = stored[this.STORAGE_KEY] || {};

    titleIndex[baseTitle] = version;
    await chrome.storage.local.set({ [this.STORAGE_KEY]: titleIndex });
  },

  /**
   * Get all stored title versions
   * @returns {Promise<Object>} - Map of base titles to version numbers
   */
  async getAllVersions() {
    const stored = await chrome.storage.local.get(this.STORAGE_KEY);
    return stored[this.STORAGE_KEY] || {};
  },

  /**
   * Reset all title versioning data
   * Useful for testing or cleanup
   */
  async resetIndex() {
    await chrome.storage.local.remove(this.STORAGE_KEY);
  },

  /**
   * Get version info for a specific title
   * @param {string} title - Title to look up
   * @returns {Promise<{base: string, currentVersion: number, nextVersion: number}>}
   */
  async getVersionInfo(title) {
    const { base, version } = this.parseTitle(title);
    const stored = await chrome.storage.local.get(this.STORAGE_KEY);
    const titleIndex = stored[this.STORAGE_KEY] || {};

    const storedVersion = titleIndex[base] || 0;
    const currentVersion = Math.max(version, storedVersion);

    return {
      base,
      currentVersion,
      nextVersion: currentVersion + 1
    };
  }
};

// Export convenience functions for use in content scripts
async function getVersionedTitle(currentTitle) {
  return TitleVersioner.getNextVersion(currentTitle);
}

async function updateTitleIndex(versionedTitle) {
  const { base, version } = TitleVersioner.parseTitle(versionedTitle);
  if (version > 0) {
    await TitleVersioner.updateTitleIndex(base, version);
  }
}

async function getAllTitleVersions() {
  return TitleVersioner.getAllVersions();
}

// Make available globally
if (typeof window !== 'undefined') {
  window.TitleVersioner = TitleVersioner;
  window.getVersionedTitle = getVersionedTitle;
  window.updateTitleIndex = updateTitleIndex;
  window.getAllTitleVersions = getAllTitleVersions;
}
