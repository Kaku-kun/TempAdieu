const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));


app.post("/ajouter-invite", (req, res) => {

  const nom = req.body.name?.trim();

  if (!nom) {
    return res.status(400).json({
      error: "Nom manquant"
    });
  }

  const fichier = path.join(__dirname, "public", "presencePot.json");

  try {

    const invites = JSON.parse(
      fs.readFileSync(fichier, "utf8")
    );

    const nouvelId = invites.length
      ? Math.max(...invites.map(invite => invite.id)) + 1
      : 1;

    const nouvelInvite = {
      id: nouvelId,
      name: nom
    };

    invites.push(nouvelInvite);

    fs.writeFileSync(
      fichier,
      JSON.stringify(invites, null, 2),
      "utf8"
    );

    res.json(nouvelInvite);

  } catch (error) {

    console.error("Erreur :", error);

    res.status(500).json({
      error: "Impossible d'enregistrer l'invité"
    });

  }

});

app.delete("/annuler-invite/:id", (req, res) => {

  const id = Number(req.params.id);

  const fichier = path.join(__dirname, "public", "presencePot.json");

  try {

    const invites = JSON.parse(
      fs.readFileSync(fichier, "utf8")
    );

    const nouveauxInvites = invites.filter(invite => invite.id !== id);

    fs.writeFileSync(
      fichier,
      JSON.stringify(nouveauxInvites, null, 2),
      "utf8"
    );

    res.json({
      success: true
    });

  } catch (error) {

    console.error("Erreur :", error);

    res.status(500).json({
      error: "Impossible de supprimer l'invité"
    });

  }

});


app.listen(port, "0.0.0.0", () => {
  console.log(`Serveur démarré sur le port ${port}`);
});