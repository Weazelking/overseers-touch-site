/* Website visit counter for The Overseer's Touch.
   No cookies and nothing personal: it reports only which page was viewed and
   where the visit came from (a ?src= label from our links and QR codes, the
   referring site, or "direct"). The source is kept for this browser tab only
   (sessionStorage) so a later sign-up can say where the visit began. */
(function () {
  var HOST = "https://tap.theoverseerstouch.com";
  var src = "";
  try {
    var q = new URLSearchParams(location.search);
    src = q.get("src") || q.get("utm_source") || "";
  } catch (e) {}
  var ref = "";
  try { ref = document.referrer ? new URL(document.referrer).hostname : ""; } catch (e) {}
  var internal = /(^|\.)theoverseerstouch\.com$/.test(ref);
  var saved = "";
  try { saved = sessionStorage.getItem("ot_src") || ""; } catch (e) {}
  // Source of this visit: an explicit label, else the outside site we came from,
  // else what this tab already arrived with, else direct.
  var visitSource = src || (ref && !internal ? ref : "") || saved || "direct";
  try { if (!saved || src || (ref && !internal)) sessionStorage.setItem("ot_src", visitSource); } catch (e) {}
  // Count the view: clicks between our own pages are "internal" (page views, not visits).
  var reported = internal && !src ? "internal" : visitSource;
  var img = new Image();
  img.src = HOST + "/hit.gif?p=" + encodeURIComponent(location.pathname) + "&s=" + encodeURIComponent(reported) + "&t=" + Date.now();
  // Pass the source along to the sign-up / call form.
  var links = document.querySelectorAll('a[href^="' + HOST + '/start"]');
  for (var i = 0; i < links.length; i++) {
    var a = links[i];
    if (a.href.indexOf("src=") === -1) a.href += (a.href.indexOf("?") === -1 ? "?" : "&") + "src=" + encodeURIComponent(visitSource);
  }
})();
