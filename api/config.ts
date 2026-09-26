class config {
  static debugMode = true;
  static port = 4326;
  static defaultHeaders: ResponseInit["headers"] = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authentication, content-type, Ashenuuid",
  };
  static dateFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  year: "numeric", month: "2-digit", day: "2-digit",
});
}

export { config };
