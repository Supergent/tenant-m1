import type { Config } from "tailwindcss";
import { tailwindPreset } from "@jn7fqjwvd2xww9rw4304asgdw57shp08/design-tokens/tailwind.preset";

const config: Config = {
  darkMode: ["class"],
  presets: [tailwindPreset],
  content: ["./src/**/*.{{ts,tsx}}"],
  plugins: [],
};

export default config;
