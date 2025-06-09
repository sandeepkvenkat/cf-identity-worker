/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Secure endpoint
    if (path === "/secure") {
      const headers = request.headers;
      const email = headers.get("cf-access-authenticated-user-email") || "anonymous@example.com";
      const country = headers.get("cf-ipcountry") || "XX";
      const timestamp = new Date().toISOString();

      const html = `
        <!DOCTYPE html>
        <html>
        <body>
          <p>${email} authenticated at ${timestamp} from 
          <a href="/secure/${country}">${country}</a></p>
        </body>
        </html>
      `;

      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    // /secure/{COUNTRY} - serve flag image
    const match = path.match(/^\/secure\/([A-Z]{2})$/);
    if (match) {

      const countryCode = match[1].toLowerCase(); // normalize to lowercase
      const key = `${countryCode}.png`; // all flags stored lowercase with .png


      const object = await env.FLAGS_BUCKET.get(key);

      if (!object) {
        return new Response("Flag not found", { status: 404 });
      }

      return new Response(object.body, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
        },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
   
 
