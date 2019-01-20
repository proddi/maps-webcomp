import {html, render, repeat} from '../map/lit-html.js';
import {elementTemplate} from '../map/tools.js';
import {RouteObserver} from '../map/mixins.js';

import '/node_modules/@polymer/paper-item/paper-icon-item.js';
import '/node_modules/@polymer/paper-item/paper-item-body.js';
import '/node_modules/@polymer/iron-icons/iron-icons.js';
import '/node_modules/@polymer/iron-icons/maps-icons.js';


/**
 * Selector watches a router and emits style events according to user input (mouse)
 *
 * @example
 * <router id="router" ...></router>
 *
 * <route-selector router="#router"></route-selector>
 *
 * @extends {RouteObserver}
 * @extends {HTMLElement}
 *
 **/
class RouteSelector extends RouteObserver(HTMLElement) {
    constructor() {
        super();

        // get templates
        this._baseRenderer = baseRenderer;
        this._routeRenderer = routeRenderer;

        // prepare root
        this.attachShadow({mode: 'open'});
    }

    onRouteRequest(request) {
        this.showLoading(request);
    }

    onRouteResponse(response) {
        this.showResponse(response);
    }

    onRouteClear() {
        render(this._baseRenderer(this, {}, this._routeRenderer), this.shadowRoot);
    }

    showLoading(request) {
        this.onRouteClear();
    }

    showResponse(response) {
        render(this._baseRenderer(this, response, this._routeRenderer), this.shadowRoot);
    }
}


import {Leg, Transport} from '../generics.js';


const WAITING = new Transport({type: "wait", name: "wait", color: "transparent", summary: "Waiting..."});

function foo(response, route) {
    let departure = response.routes.map(route => route.departure).reduce((prev, curr) => curr.time < prev.time ? curr : prev);
    let arrival = response.routes.map(route => route.arrival).reduce((prev, curr) => curr.time > prev.time ? curr : prev);
    let duration = (arrival.time - departure.time) / 100;
    let waiting = new Leg(departure, route.legs[0].departure, WAITING, [], {id:"0", summary: "wait here"});
    return [waiting].concat(route.legs).map(leg => [leg, (leg.arrival.time - leg.departure.time)/duration]);
}


function baseRenderer(self, response, routeTemplate) {
    return html`
    <style>
        :host {
            display: block;
            overflow-y: hidden;
            overflow-y: auto;
        }
        :host .route-lines {
            background-color: #f0f0f0;
            width: 100%;
            border-radius: 0.9rem;
            height: 0.3rem;
            margin: 0.2rem 0 0.3rem 0;
        }
        :host .route-lines > span {
            display: inline-block;
            vertical-align: top;
            height: 0.3rem;
            border-right: 2px solid white;
            background-color: #b7b9bc;
        }
        :host .route-lines > span.walk {
            background-color: #b7b9bc;
        }
        :host .route-lines > span.car {
            background-color: #2c48a1;
        }
        :host .provider {
            float: right;
        }
        :host paper-icon-item {
            cursor: pointer;
        }
        :host paper-icon-item:hover {
            background-color: rgba(128, 128, 128, .12);
        }
    </style>

    <div role="listbox">
        <div>${response.error}</div>
        ${repeat(response.routes || [], (route) => route.id, (route, index) => routeTemplate(self, route, response))}
    </div>
`;
}


function routeRenderer(self, route, response) {
    return html`
      <paper-icon-item data-route="${route.uid}"
            @click=${_ => self.routeSource.selectRoute(route)}
            @mouseenter=${_ => self.routeSource.emphasizeRoute(route, "highlighted")}
            @mouseleave=${_ => self.routeSource.emphasizeRoute(route)}>
        <iron-icon icon="maps:directions-transit" slot="item-icon"></iron-icon>
        <paper-item-body three-line>
          <div>${route.duration}</div>
          <div secondary>
            <div class="route-modes">
                ${route.legs.filter(leg => leg.transport.type !== "walk").map(leg => html`<span class="leg leg-${leg.transport.type}" title="${leg.summary || ''}" style="color: ${leg.transport.color};">${leg.transport.name}</span>  &rsaquo; `)}
            </div>
            <div class="route-lines">
                ${foo(response, route).map(([leg, width]) => html`<span class="${leg.transport.type}" title="${leg.summary || ''}" style="width: ${width}%; background-color: ${leg.transport.color};"></span>`)}
            </div>
            <div class="route-details">
                <span class="provider">${route.router.name}</span>
                Leave: ${route.departure.timeString} -&gt; ${route.arrival.timeString}
            </div>
          </div>
        </paper-item-body>
      </paper-icon-item>
`;
}


customElements.define('route-selector', RouteSelector);


export { RouteSelector }
