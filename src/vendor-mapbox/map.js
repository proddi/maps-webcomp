import { parseCoordString, findRootElement} from '../generics.js';
import { MapboxPlatform } from './platform.js';


/**
 * Shows HERE map. This is the base canvas for other visualisation elements.
 * It requires a {@link MapboxPlatform} component to handle credentials.
 *
 * @example <caption>smallest setup</caption>
 * <mapbox-platform token="..."></mapbox-platform>
 *
 * <mapbox-map platform="mapbox-platform" center="13.5,52.5" zoom="11">
 * </mapbox-map>
 *
 * @see https://www.mapbox.com/mapbox.js/api/v3.1.1/
 **/
class MapboxMap extends HTMLElement {
    constructor() {
        super();
        let platform = findRootElement(this, this.getAttribute("platform"), MapboxPlatform);
        let center = parseCoordString(this.getAttribute("center"));
        let zoom   = this.getAttribute("zoom");

        /** @type {Promise<{L: L, map:L.mapbox.map}>} */
        this.whenReady = platform.whenReady.then(({L}) => {
            let map = L.mapbox.map(this, 'mapbox.streets', {
                zoomControl: false
            }).setView(center, zoom);
            return {L:L, map:map};
        });
    }
}


/**
 * @external {L.mapbox.map} https://www.mapbox.com/mapbox.js/api/v3.1.1/l-mapbox-map/
 */


customElements.define("mapbox-map", MapboxMap);


export { MapboxMap }
