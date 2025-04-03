# Hello

## 1. Fix the CORS issue

The first fix had to do with the origin of the request, since the widget is injected in the DOM,
the origin is the website that's hosting the DOM, so to fix it, you simply have to move the request
to the background (service-worker), so that the origin becomes the extension itself, and not the
website the request is coming from.

So in order to do it, we simply send a message from the chrome runtime to the service worker, who's listening for a specific action, then do the request, wrap it into a small service and let it be used by the widget depending on the context, if it's the web app, it'll do the request directly, if it's the extension context, the extension will take the relay and do it itself, thus, do the request with the correct origin that's authorized by the API.

## 4. Task

I left some comments in the new controllers for Kamernet's dynamic classes