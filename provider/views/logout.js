module.exports.logout = (ctx, form) => `<!DOCTYPE html>
  <head>
    <title>Se déconnecter</title>
    <link rel="stylesheet" href="http://${ctx.host}/styles/index.css">
  </head>
  <body>
    <span class="container">
      <img src="http://${ctx.host}/img/logo.png">
      <p style="text-align: center" class="title">Voulez-vous vous déconnecter de Potions ?</p>
      ${form}
      <span style="display: flex; flex-direction: row; justify-content: center">
        <button type="submit" form="op.logoutForm" value="yes" name="logout">SE DÉCONNECTER</button>
        <button class="cancel" onclick="history.back()">ANNULER</button>
      </span>
    </span>
  </body>
</html>`;
