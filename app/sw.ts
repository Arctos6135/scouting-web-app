import { registerRoute, NavigationRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler, {
	denylist: [new RegExp('/verify/')],
});

registerRoute(navigationRoute);

registerRoute(
	({ request }) => request.destination === 'script' ||
		request.destination === 'style' ||
		request.destination === 'image',
	new StaleWhileRevalidate({
		cacheName: 'static-resources',
	})
);