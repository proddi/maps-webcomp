import {parseCoordString, findRootElement} from './generics.js';


/**
 * Contains a clickable route
 *
 * @example
 * <router id="router" ...></router>
 *
 * <route-link router="#router" start="lat,lng" dest="lat,lng" time=".."></route-link>
 **/
class RouteLink extends HTMLElement {
    constructor() {
        super();
//        this.attachShadow({mode: 'open'});

        this.addEventListener("click", (ev) => {
            let router = findRootElement(this, this.getAttribute("router"));
            router.update(parseCoordString(this.getAttribute("start")), parseCoordString(this.getAttribute("dest")), this.getAttribute("time"));
        });
    }
}


customElements.define("route-link", RouteLink);


export { RouteLink }