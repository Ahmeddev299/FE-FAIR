const local = {
  API_ENDPOINT: "http://localhost:5000",
};
const dev = {
  API_ENDPOINT: "https://dev-api.fair.com",
};
const stag = {
  API_ENDPOINT: "http://3.131.241.239:5000",
};
const prod = {
  API_ENDPOINT: "http://3.131.241.239:5000",
};
const config = {
  ...(process.env.NEXT_PUBLIC_STAGE === "local"
    ? local
    : process.env.NEXT_PUBLIC_STAGE === "dev"
    ? dev
    : process.env.NEXT_PUBLIC_STAGE === "stag"
    ? stag
    : prod),
};

export default config;
