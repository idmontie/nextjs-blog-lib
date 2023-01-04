import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    transform: {
        "^.+\\.[tj]sx?$": ["babel-jest", {
            presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
        }],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    rootDir: "./src",
};

export default config;