export const setCookie = (cname, cvalue, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  if (process.env.NODE_ENV === "development") {
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  } else {
    let currentDomain = window.location.hostname;
    let parts = currentDomain.split(".");
    let secondLevelDomain = parts[parts.length - 2];
    let topLevelDomain = parts[parts.length - 1];
    let actualDomain = "." + secondLevelDomain + "." + topLevelDomain;
    document.cookie =
      cname + "=" + cvalue + ";" + expires + `;domain=${actualDomain};path=/;`;
  }
};

export const getCookie = (cname) => {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};
