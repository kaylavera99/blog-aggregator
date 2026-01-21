import fs from 'fs';
import path from 'path';
import os from 'os';

export type Config = {
    dbUrl: string;
    currentUserName: string;
};

export function setUser(userName: string): void {
    const cfg = readConfig();
    cfg.currentUserName = userName;
    writeConfig(cfg);
}

export function readConfig(): Config {
    const filePath = getConfigFilePath();

    const raw = fs.readFileSync(filePath, 'utf-8');
    let parsed: any;
    try {
        parsed = JSON.parse(raw);
    } catch (e) {
        throw new Error(`Failed to parse config file at ${filePath}: ${(e as Error).message}`);
    }

    return validateConfig(parsed);
}

export function getConfigFilePath() {
    const configFileName = '.gatorconfig.json';
    const homeDir = os.homedir();
    return path.join(homeDir, configFileName);
}

export function writeConfig(cfg: Config): void {
    const filePath = getConfigFilePath();
    const toSave = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName,
    };
    fs.writeFileSync(filePath, JSON.stringify(toSave, null, 2) + "\n", {
        encoding: 'utf-8',
    });
};

export function validateConfig(rawConfig: any) : Config {
    if (rawConfig.db_url === undefined || typeof rawConfig.db_url !== 'string') {
        throw new Error("Invalid config: 'db_url' is required and must be a string");
    }

    const current = rawConfig.current_user_name;
    if (current !== undefined && current !== null && typeof current !== 'string') {
        throw new Error("Invalid config: 'current_user_name' must be a string or null");
    }

    const config: Config = {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name,
    }

    return config;
}