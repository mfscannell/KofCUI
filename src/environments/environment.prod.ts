export const environment = {
  production: true,
  domain: 'localhost:4200',
  numDomains: 2,
  tenants: [
    {
      tenantName: "htknights",
      tenantId: "1234"
    },
    {
      tenantName: "hsknights",
      tenantId: "5678"
    }
  ],
  baseUrl: "http://localhost:8000/",
  apiBaseUrl: "http://localhost:8000/api/"
};
