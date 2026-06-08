import { networkInterfaces } from "node:os";

const port = Number(process.env.PORT ?? 3000);

function getLanUrls() {
  return Object.values(networkInterfaces())
    .flat()
    .filter((address) => address && address.family === "IPv4" && !address.internal)
    .map((address) => `http://${address.address}:${port}`);
}

const lanUrls = getLanUrls();

console.log("Links atuais para abrir no iPad/celular na mesma rede Wi-Fi:");

if (lanUrls.length === 0) {
  console.log("- Nenhum IP de rede local foi detectado.");
  console.log("- Verifique se o computador está conectado ao Wi-Fi e rode npm run dev novamente.");
} else {
  lanUrls.forEach((url) => console.log(`- ${url}`));
}

console.log("\nObservação: esse link pode mudar quando o Wi-Fi, VPN, Docker/WSL ou o computador reiniciar.");
console.log("Se um link antigo parar, rode `npm run ipad:link` ou abra `http://localhost:3000/access` no computador para copiar o link atual.");
