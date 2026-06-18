import { TextDecoder, TextEncoder } from "node:util";

Object.assign(globalThis, { TextEncoder, TextDecoder });

import "@testing-library/jest-dom";
