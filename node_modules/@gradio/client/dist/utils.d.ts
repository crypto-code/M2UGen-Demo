import type { Config } from "./types.js";
export declare function determine_protocol(endpoint: string): {
    ws_protocol: "ws" | "wss";
    http_protocol: "http:" | "https:";
    host: string;
};
export declare const RE_SPACE_NAME: RegExp;
export declare const RE_SPACE_DOMAIN: RegExp;
export declare function process_endpoint(app_reference: string, token?: `hf_${string}`): Promise<{
    space_id: string | false;
    host: string;
    ws_protocol: "ws" | "wss";
    http_protocol: "http:" | "https:";
}>;
export declare function map_names_to_ids(fns: Config["dependencies"]): Record<string, number>;
export declare function discussions_enabled(space_id: string): Promise<boolean>;
export declare function get_space_hardware(space_id: string, token: `hf_${string}`): Promise<any>;
export declare function set_space_hardware(space_id: string, new_hardware: typeof hardware_types[number], token: `hf_${string}`): Promise<any>;
export declare function set_space_timeout(space_id: string, timeout: number, token: `hf_${string}`): Promise<any>;
export declare const hardware_types: readonly ["cpu-basic", "cpu-upgrade", "t4-small", "t4-medium", "a10g-small", "a10g-large", "a100-large"];
//# sourceMappingURL=utils.d.ts.map