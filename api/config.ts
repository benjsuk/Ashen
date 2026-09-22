class config {
  static debugMode = true;
  static port = 4326;
  static defaultHeaders: ResponseInit["headers"] = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authentication, content-type, Ashenuuid",
  };
}

export { config };
