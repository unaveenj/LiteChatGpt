#!/usr/bin/env python3
"""
LiteChatGPT Extension Health Check
Verifies all files are present and valid before loading
"""

import os
import json
import sys

def check_file_exists(filepath, required=True):
    """Check if a file exists"""
    exists = os.path.exists(filepath)
    status = "[OK]" if exists else ("[MISSING]" if required else "[OPTIONAL]")
    size = os.path.getsize(filepath) if exists else 0
    print(f"  {status} {filepath} ({size} bytes)")
    return exists

def check_json_valid(filepath):
    """Check if JSON file is valid"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            json.load(f)
        print(f"  [OK] {filepath} - Valid JSON")
        return True
    except Exception as e:
        print(f"  [ERROR] {filepath} - Invalid JSON: {e}")
        return False

def main():
    print("=" * 60)
    print("LiteChatGPT Extension Health Check")
    print("=" * 60)
    print()

    # Change to extension directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    all_ok = True

    # Check manifest.json
    print("[MANIFEST] Checking manifest.json...")
    if check_file_exists("manifest.json"):
        if not check_json_valid("manifest.json"):
            all_ok = False
    else:
        all_ok = False
    print()

    # Check core files
    print("[CORE] Checking core JavaScript files...")
    core_files = [
        "background.js",
        "content.js",
        "popup.js"
    ]
    for f in core_files:
        if not check_file_exists(f):
            all_ok = False
    print()

    # Check utility files
    print("[UTILS] Checking utility files...")
    util_files = [
        "utils/dom-selectors.js",
        "utils/title-versioner.js",
        "utils/context-extractor.js"
    ]
    for f in util_files:
        if not check_file_exists(f):
            all_ok = False
    print()

    # Check UI files
    print("[UI] Checking UI files...")
    ui_files = [
        "popup.html",
        "styles.css"
    ]
    for f in ui_files:
        if not check_file_exists(f):
            all_ok = False
    print()

    # Check icons
    print("[ICONS] Checking icon files...")
    icon_files = [
        "icons/icon16.png",
        "icons/icon48.png",
        "icons/icon128.png"
    ]
    for f in icon_files:
        if not check_file_exists(f):
            all_ok = False
    print()

    # Check documentation
    print("[DOCS] Checking documentation...")
    doc_files = [
        "README.md",
        "INSTALL.md",
        "TESTING_GUIDE.md"
    ]
    for f in doc_files:
        check_file_exists(f, required=False)
    print()

    # Validate manifest structure
    print("[VALIDATION] Validating manifest structure...")
    try:
        with open("manifest.json", 'r', encoding='utf-8') as f:
            manifest = json.load(f)

        required_keys = [
            "manifest_version",
            "name",
            "version",
            "description",
            "permissions",
            "host_permissions",
            "background",
            "content_scripts",
            "action",
            "icons"
        ]

        for key in required_keys:
            if key in manifest:
                print(f"  [OK] {key}: present")
            else:
                print(f"  [ERROR] {key}: MISSING")
                all_ok = False

        # Check manifest version
        if manifest.get("manifest_version") == 3:
            print(f"  [OK] Manifest V3 confirmed")
        else:
            print(f"  [ERROR] Wrong manifest version: {manifest.get('manifest_version')}")
            all_ok = False

    except Exception as e:
        print(f"  [ERROR] Error reading manifest: {e}")
        all_ok = False
    print()

    # File size check
    print("[STATS] File Statistics...")
    total_size = 0
    for root, dirs, files in os.walk('.'):
        # Skip .claude directory
        if '.claude' in root:
            continue
        for file in files:
            if file.endswith(('.js', '.json', '.html', '.css', '.md', '.png')):
                filepath = os.path.join(root, file)
                size = os.path.getsize(filepath)
                total_size += size

    print(f"  Total extension size: {total_size:,} bytes ({total_size/1024:.1f} KB)")
    print()

    # Final status
    print("=" * 60)
    if all_ok:
        print("HEALTH CHECK PASSED - Extension Ready!")
        print()
        print("Extension is ready to load in Chrome!")
        print()
        print("Next steps:")
        print("1. Open Chrome and go to: chrome://extensions/")
        print("2. Enable 'Developer mode'")
        print("3. Click 'Load unpacked'")
        print("4. Select this folder: " + script_dir)
        print()
        return 0
    else:
        print("HEALTH CHECK FAILED")
        print()
        print("Please fix the issues above before loading the extension.")
        print()
        return 1

if __name__ == "__main__":
    sys.exit(main())
