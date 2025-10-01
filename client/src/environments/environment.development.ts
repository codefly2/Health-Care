export const environment = {
  production: false,
  apiUrl: window.origin.replace("_33329", "")+"/proxy/5000"
};

// sudo lsof -i :<portnumber>
// kill 9 :<pid>