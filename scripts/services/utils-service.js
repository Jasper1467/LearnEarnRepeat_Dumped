export class UtilsService {
    static getObjNestedValue(obj, path) {
        /**
         * This is ugly to support:
         * BG GEP _onInfoUpdate {"info":{"match_info":{"game_mode":"{\"mode\":\"deathmatch\",\"custom\":false,\"ranked\":\"2\"}"}},"feature":"match_info"}
         */
        return path.split('.').reduce((p, c) => {
            if (!p) return null;
            try {
                const r = JSON.parse(p[c]);
                return r || null;
            } catch (e) {
                return p[c] || null;
            }
        }, obj);
    };

    /**
     * Made to make sure we are not blinking too fast with the loading state when the actual loading is really fast
     */
    static async waitForLoadingToggleOff(loadingStartTime) {
        const minTime = 400;
        const elapsedTime = Date.now() - loadingStartTime;
        if (elapsedTime < minTime) {
            await new Promise((resolve) => setTimeout(resolve, minTime - elapsedTime));
        }
    };

    static replaceAssetPathToAbsoluteLocalPath(assetPath) {
        if (assetPath.startsWith('./../assets/')) {
            return assetPath.replace(
                "./../assets/",
                "overwolf-extension://hepmnpdgpljeekpkccemnnoajoombagagpkcncca/windows/desktop/static-assets/"
            );
        } else if (assetPath.startsWith('../static-assets')) {
            return assetPath.replace(
                "../static-assets/",
                "overwolf-extension://hepmnpdgpljeekpkccemnnoajoombagagpkcncca/windows/desktop/static-assets/"
            );
        }

        return assetPath;
    }
}