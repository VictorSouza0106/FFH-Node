import { connect } from "mongoose";

let dbName = "FFH_DB";

var dbUrl = `mongodb+srv://Crypt_admin:nDKqYNPEhdhZ23Pm@ffh-cluster.ltjtgyg.mongodb.net/${dbName}?retryWrites=true&w=majority`;

export function connectDB() {
  connect(dbUrl)
    .then(() => {
      console.log("Conectado ao MongoDB");
    })
    .catch((err) => {
      console.error("Erro de conexão:", err);
    });
}
