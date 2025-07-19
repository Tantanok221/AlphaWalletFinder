import { Helius } from "npm:helius-sdk";

const helius = new Helius(Deno.env.get("HELIUS_API_TOKEN"));
const response = await helius.rpc.getAssetsByOwner({
  ownerAddress: "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY",
  page: 1,
});

console.log(response.items);
