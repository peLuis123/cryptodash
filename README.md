# CryptoDash

Dashboard base en React + Vite + Tailwind.

## API (Axios + Interceptores)

Se configuró una capa API reusable para CoinGecko en `src/api`:

- `src/api/axios.js`: instancia base de Axios + headers + interceptores

### Variables de entorno

Usa `.env.example` como base:

```bash
VITE_COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
VITE_API_TIMEOUT=10000
VITE_COINGECKO_API_KEY=
```

### Uso rápido

```js
import apiClient from "./api/axios";

const { data: global } = await apiClient.get("/global");
const { data: markets } = await apiClient.get("/coins/markets", {
  params: { vs_currency: "usd", sparkline: true },
});
```
